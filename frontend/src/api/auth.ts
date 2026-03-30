import API from "./axios";

// ---------------------------------------------
// Auth API layer
//
// Provides abstraction over HTTP requests related to:
// - authentication
// - user identity
//
// Keeps components free from direct API details
// ---------------------------------------------

// ---------------------------------------------
// Sign up new user
// - Creates user account on backend
// - Returns authentication token on success
// ---------------------------------------------
export const signup = (data: {
    username: string;
    password: string;
  }) => {
    return API.post("/api/auth/signup", data);
  };
  
  // ---------------------------------------------
  // Sign in existing user
  // - Authenticates credentials
  // - Returns authentication token
  // ---------------------------------------------
  export const signin = (data: {
    username: string;
    password: string;
  }) => {
    return API.post("/api/auth/signin", data);
  };
  
  // ---------------------------------------------
  // Fetch current authenticated user
  // - Requires valid token (attached via interceptor)
  // - Used for protected profile page
  // ---------------------------------------------
  export const getMe = () => {
    return API.get("/api/me");
  };
  
  // ---------------------------------------------
  // Sign out current user
  // - Notifies backend to invalidate token/session
  // - Frontend should also clear local storage
  // ---------------------------------------------
  export const signout = () => {
    return API.post("/api/auth/signout");
  };