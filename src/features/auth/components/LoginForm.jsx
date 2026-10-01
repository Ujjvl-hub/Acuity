import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import api from "../../../api/axios";


const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // Render free-tier wake-up retry state
  const [retrying, setRetrying] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);


  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));


  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setRetrying(false);
    setRetryAttempt(0);

    if (!identifier.trim() || !password) {
      setError("Enter your username/email and password to continue.");
      return;
    }

    setLoading(true);

    const maxRetries = 2;

    try {
      let response;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            setRetrying(true);
            setRetryAttempt(attempt);

            await sleep(3000);
          }

          response = await api.post("/api/users/login/", {
            identifier: identifier.trim(),
            password,
          });

          break;
        } catch (err) {
          const status = err?.response?.status;

          // Retry only for server/wake-up related errors
          const shouldRetry =
            !status ||
            status === 502 ||
            status === 503 ||
            status === 504;

          if (!shouldRetry || attempt === maxRetries) {
            throw err;
          }
        }
      }

      const { user, tokens } = response.data;

      login(user, tokens);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      const serverMessage = err?.response?.data?.error;

      if (serverMessage) {
        setError(serverMessage);
      } else if (!err?.response) {
        setError(
          "Unable to connect to the server. Please try again."
        );
      } else {
        setError("Invalid username/email or password.");
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };


  return (
    <form onSubmit={handleLogin} className="space-y-5">

      {/* Username / Email */}
      <div>
        <label
          htmlFor="identifier"
          className="mb-2 block text-sm font-medium text-[#12151C]"
        >
          Username or Email
        </label>

        <input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter your username or email"
          autoComplete="username"
          required
          disabled={loading}
          className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 text-sm text-[#12151C] outline-none transition placeholder:text-[#9AA1AB] focus:border-[#1F7A5C] focus:ring-2 focus:ring-[#1F7A5C]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
      </div>


      {/* Password */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#12151C]"
          >
            Password
          </label>

          <button
            type="button"
            className="text-xs font-medium text-[#1F7A5C] transition hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            disabled={loading}
            className="w-full rounded-xl border border-[#DDE1E6] bg-white px-4 py-3 pr-12 text-sm text-[#12151C] outline-none transition placeholder:text-[#9AA1AB] focus:border-[#1F7A5C] focus:ring-2 focus:ring-[#1F7A5C]/10 disabled:cursor-not-allowed disabled:bg-gray-50"
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5B6472] transition hover:text-[#12151C]"
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>


      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* Render wake-up message */}
      {retrying && (
        <div className="rounded-xl border border-[#DDE1E6] bg-[#F6F7F4] px-4 py-3 text-sm text-[#5B6472]">
          Server is waking up. Retrying...
          {retryAttempt > 0 && ` Attempt ${retryAttempt}/2`}
        </div>
      )}


      {/* Login button */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1F7A5C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#176548] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {retrying ? "Waking server..." : "Signing in..."}
          </>
        ) : (
          "Sign in"
        )}
      </button>


      {/* Register */}
      <p className="text-center text-sm text-[#5B6472]">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="font-semibold text-[#1F7A5C] hover:underline"
        >
          Create account
        </button>
      </p>

    </form>
  );
};

export default LoginForm;