import axios from "axios";

/**
 * Dev: empty baseURL sends /api/* to the Vite proxy → http://localhost:5000 (no CORS).
 * Prod: set VITE_API_URL to your API origin (e.g. https://api.example.com).
 */
const envUrl = import.meta.env.VITE_API_URL?.trim();
const baseURL = import.meta.env.DEV && !envUrl ? "" : envUrl || "http://localhost:5000";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      const isAuthPage = path.includes("/login") || path.includes("/register");
      localStorage.removeItem("token");
      if (!isAuthPage) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
