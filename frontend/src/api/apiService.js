import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiService = {
  // ── Auth ──────────────────────────────────────────────
  login: (email, password) =>
    axios.post(`${API_BASE_URL}/auth/login`, { email, password }),

  signup: (fullName, email, password) =>
    axios.post(`${API_BASE_URL}/auth/signup`, { fullName, email, password }),

  register: (name, email, password) =>
    axios.post(`${API_BASE_URL}/auth/register`, { name, email, password }),

  logout: () => axios.post(`${API_BASE_URL}/auth/logout`),

  // ── User profile (per-account bio, etc.) ───────────────
  getUserProfile: (userId) =>
    axios.get(`${API_BASE_URL}/user/${userId}/profile`),

  updateUserProfile: (userId, payload) =>
    axios.put(`${API_BASE_URL}/user/${userId}/profile`, payload),

  // ── Interview (legacy setup form) ─────────────────────
  startInterview: (data) =>
    axios.post(`${API_BASE_URL}/interview/start`, data),

  // ── Interview (new role-based flow) ───────────────────
  // POST /api/interview/start?jobRole=X&userId=Y&difficulty=Z&format=W&useResume=true
  startInterviewSession: (jobRole, userId, difficulty, format, useResume = false) =>
    axios.post(
      `${API_BASE_URL}/interview/start?jobRole=${encodeURIComponent(jobRole)}&userId=${userId}&difficulty=${encodeURIComponent(difficulty || 'Medium')}&format=${encodeURIComponent(format || 'Q/A')}&useResume=${useResume}`
    ),

  // POST /api/interview/answer { sessionId, question, answer }
  submitAnswer: (payload) =>
    axios.post(`${API_BASE_URL}/interview/answer`, payload),

  getNextQuestion: (sessionId) =>
    axios.get(`${API_BASE_URL}/interview/question/${sessionId}`),

  getAnalysis: (sessionId) =>
    axios.get(`${API_BASE_URL}/interview/analysis/${sessionId}`),

  // ── History ───────────────────────────────────────────
  getHistory: (userId) =>
    axios.get(`${API_BASE_URL}/interview/history/${userId}`),

  deleteHistory: (sessionId, userId) =>
    axios.delete(`${API_BASE_URL}/interview/history/${sessionId}?userId=${userId}`),

  // ── Stats ─────────────────────────────────────────────
  getStats: (userId) =>
    axios.get(`${API_BASE_URL}/interview/stats/${userId}`),

  getDashboardStats: () =>
    axios.get(`${API_BASE_URL}/dashboard/stats`),

  // ── Health ────────────────────────────────────────────
  healthCheck: () => axios.get(`${API_BASE_URL}/health`),

  // ── Resume ────────────────────────────────────────────
  uploadResume: (file, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    return axios.post(`${API_BASE_URL}/resume/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getLatestResumeAnalysis: (userId) =>
    axios.get(`${API_BASE_URL}/resume/latest/${userId}`),

  getUserResumes: (userId) =>
    axios.get(`${API_BASE_URL}/resume/list/${userId}`),

  // ── Analytics ─────────────────────────────────────────
  getPerformanceMetrics: (userId) =>
    axios.get(`${API_BASE_URL}/analytics/performance/${userId}`),
};

export default apiService;