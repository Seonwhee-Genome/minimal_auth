import axios from "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
      skipAuthRedirect?: boolean;
    }
  }

// ---------------------------------------------
// Axios instance
// Centralized HTTP client configuration
// - Base URL for backend API
// - Shared headers / interceptors
// ---------------------------------------------
const API = axios.create({
  baseURL: "http://localhost:8080",
});

// ---------------------------------------------
// Request interceptor
// Automatically attaches authentication token
// to every outgoing request (if available)
//
// This removes the need to manually pass token
// in each API call and keeps API layer clean
// ---------------------------------------------
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    // Attach token using Bearer scheme
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ---------------------------------------------
// Response interceptor (optional enhancement)
//
// Handles global API errors such as:
// - Unauthorized (401) → force logout
// - Token expiration scenarios
//
// Centralizing this logic avoids duplication
// across components
// ---------------------------------------------
API.interceptors.response.use(
    (response) => response,
    (error) => {

        // ---------------------------------------------
        // Skip redirect if explicitly disabled
        // ---------------------------------------------
        if (error.config?.skipAuthRedirect) {
            return Promise.reject(error);
        }
        
        if (error.response?.status === 401) {
            // Remove invalid/expired token
            localStorage.removeItem("token");

            // Redirect user to login page
            // it can be improved with router integration)
            window.location.href = "/signin";
        }

        return Promise.reject(error);
    }
  );

  
export default API;