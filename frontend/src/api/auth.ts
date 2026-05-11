import client from "./client";

const TOKEN_KEY = "salo_token";

export const getToken  = () => localStorage.getItem(TOKEN_KEY);
export const setToken  = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);
export const isAuthenticated = () => !!getToken();

export const loginRequest = (username: string, password: string) =>
  client.post<{ access_token: string }>("/auth/login", { username, password }).then((r) => r.data);
