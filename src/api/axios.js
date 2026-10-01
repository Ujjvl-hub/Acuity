import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Render free tier may take some time to wake up.
const REQUEST_TIMEOUT_MS = 30000;
const MAX_NETWORK_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isLoginRequest = (url = "") =>
  url.includes("/api/users/login/");

const isRefreshRequest = (url = "") =>
  url.includes("/api/token/refresh/");

// GET/HEAD/OPTIONS are safe to retry.
// Login is also safe to retry because it does not create a database record.
const isRetryable = (config) => {
  const method = (config.method || "get").toLowerCase();

  return (
    ["get", "head", "options"].includes(method) ||
    isLoginRequest(config.url)
  );
};

// These errors usually mean the server is waking up or temporarily unavailable.
const isTemporaryServerError = (error) => {
  if (!error.response) {
    return true;
  }

  return [502, 503, 504].includes(error.response.status);
};

// Optional server wake-up request.
// This can be called from main.jsx when the application starts.
export const wakeServer = () => {
  const base = API_BASE_URL.replace(/\/+$/, "");

  return axios
    .get(`${base}/health/`, {
      timeout: REQUEST_TIMEOUT_MS,
    })
    .catch(() => {});
};

// Attach access token to protected requests only.
api.interceptors.request.use((config) => {
  if (
    isLoginRequest(config.url) ||
    isRefreshRequest(config.url)
  ) {
    return config;
  }

  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, token = null) => {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  pendingRequests = [];
};

const clearAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  window.location.href = "/login";
};

// Refresh the access token.
// If Render is temporarily unavailable, retry the refresh request.
const requestTokenRefresh = async (refreshToken) => {
  const baseURL = api.defaults.baseURL.replace(/\/+$/, "");

  for (let attempt = 0; ; attempt++) {
    try {
      return await axios.post(
        `${baseURL}/api/token/refresh/`,
        { refresh: refreshToken },
        {
          timeout: REQUEST_TIMEOUT_MS,
        }
      );
    } catch (error) {
      if (
        isTemporaryServerError(error) &&
        attempt < MAX_NETWORK_RETRIES
      ) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      throw error;
    }
  }
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    /*
     * ---------------------------------------------------------
     * 1. RETRY NETWORK / TEMPORARY SERVER ERRORS
     * ---------------------------------------------------------
     */

    if (
      originalRequest &&
      isRetryable(originalRequest) &&
      isTemporaryServerError(error)
    ) {
      originalRequest._networkRetries =
        originalRequest._networkRetries || 0;

      if (
        originalRequest._networkRetries <
        MAX_NETWORK_RETRIES
      ) {
        originalRequest._networkRetries += 1;

        window.dispatchEvent(
          new CustomEvent("api:retrying", {
            detail: {
              attempt: originalRequest._networkRetries,
              maxRetries: MAX_NETWORK_RETRIES,
            },
          })
        );

        await sleep(RETRY_DELAY_MS);

        return api(originalRequest);
      }

      window.dispatchEvent(
        new CustomEvent("api:retry-failed")
      );

      return Promise.reject(error);
    }

    /*
     * ---------------------------------------------------------
     * 2. EXPIRED ACCESS TOKEN
     * ---------------------------------------------------------
     */

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isLoginRequest(originalRequest.url) ||
      isRefreshRequest(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      clearAuth();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /*
     * Another request may already be refreshing the token.
     * Wait for that request instead of starting another refresh.
     */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({
          resolve,
          reject,
        });
      }).then((token) => {
        originalRequest.headers =
          originalRequest.headers || {};

        originalRequest.headers.Authorization =
          `Bearer ${token}`;

        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const response =
        await requestTokenRefresh(refreshToken);

      const newAccessToken = response.data.access;

      if (!newAccessToken) {
        throw new Error(
          "Refresh response did not contain an access token."
        );
      }

      localStorage.setItem(
        "access_token",
        newAccessToken
      );

      // Support refresh-token rotation.
      if (response.data.refresh) {
        localStorage.setItem(
          "refresh_token",
          response.data.refresh
        );
      }

      processQueue(null, newAccessToken);

      originalRequest.headers =
        originalRequest.headers || {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      /*
       * Only log the user out if the backend actually
       * rejected the refresh token.
       *
       * Do NOT log out because Render is temporarily asleep.
       */
      const status = refreshError.response?.status;

      if (status === 400 || status === 401) {
        clearAuth();
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;

