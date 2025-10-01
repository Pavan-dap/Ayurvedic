import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api"; // Django backend root

const api = axios.create({
  baseURL: API_URL,
});

// Attach token from localStorage automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
