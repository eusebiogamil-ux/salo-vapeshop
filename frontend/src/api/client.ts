/// <reference types="vite/client" />
import axios from "axios";
import { getToken, clearToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://salo-vapeshop.onrender.com";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT to every request
client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear token and redirect to login
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url?.includes("/auth/login")) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Warm up Render free-tier backend
fetch(`${BASE_URL}/health`).catch(() => {});

export default client;
