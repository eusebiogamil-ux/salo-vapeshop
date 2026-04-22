/// <reference types="vite/client" />
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Warm up the backend on app load (Render free tier spins down after inactivity)
fetch(`${BASE_URL}/health`).catch(() => {});

export default client;
