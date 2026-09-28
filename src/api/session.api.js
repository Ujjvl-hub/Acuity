
import api from "./axios.js";

export const createSession = (sessionData) => {
  return api.post("/api/sessions/", sessionData);
};

export const getSessions = () => {
  return api.get("/api/sessions/");
};

export const getDashboardData = () => {
  return api.get("/api/sessions/dashboard/");
};

export const getSession = (sessionId) => {
  return api.get(`/api/sessions/${sessionId}/`);
};

export const getSessionQuestions = (sessionId) => {
  return api.get(`/api/sessions/${sessionId}/questions/`);
};

export const submitAnswer = (sessionId, answerData) => {
  return api.post(
    `/api/sessions/${sessionId}/answers/`,
    answerData
  );
};

export const getSessionAnswers = (sessionId) => {
  return api.get(`/api/sessions/${sessionId}/answers/`);
};

export default api;