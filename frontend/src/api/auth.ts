import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const signup = (data: { username: string; password: string }) =>
  API.post("/api/auth/signup", data);

export const signin = (data: { username: string; password: string }) =>
  API.post("/api/auth/signin", data);

export const getMe = (token: string) =>
  API.get("/api/me", {
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });

export const signout = (token: string) =>
  API.post(
    "/api/auth/signout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );