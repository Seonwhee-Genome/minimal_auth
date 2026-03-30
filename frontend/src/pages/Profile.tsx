// import { useEffect, useState } from "react";
import { getMe } from "../api/auth.ts";
import { useAuth } from "../context/AuthContext.tsx";

import { useQuery } from "@tanstack/react-query";


export default function Profile() {
    const { token, logout } = useAuth(); // access auth state + logout action

    // ---------------------------------------------
    // Fetch current user profile
    // - React Query handles caching, loading, errors
    // - enabled ensures request runs only if token exists
    // ---------------------------------------------
  
    const { data, isLoading, isError } = useQuery({
      queryKey: ["me"],
      // API call to retrieve user info
      queryFn: () => getMe(token!),
      enabled: !!token, // only run if token exists to prevent unnecessary request if not authenticated
    });

    
    // Loading state     
    if (isLoading) return <p>Loading...</p>;

    // Error state  
    if (isError) return <p style={{ color: "red" }}>Failed to load profile</p>;

    // Extract user data from API response  
    const user = data?.data;
  
    return (
      <div>
        <h2>Profile</h2>  
        
        <p>Username: {user.username}</p>        
  
        <button onClick={logout}>Logout</button>
      </div>
    );
  }