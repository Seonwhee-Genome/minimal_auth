import { useState } from "react";
import type React from "react";
import { signup } from "../api/auth.ts";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");  
  
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      if (!username || !password) {
          setError("Please fill in all fields");
          return;
      }
      try {
          await signup({ username, password });
          navigate("/signin");
      }
      catch (err: any) {
          if (err.response?.status === 400) {
              const errorCode = err.response.data?.error;
              console.log(errorCode);
              setError(errorCode);
              
          } else {
              setError("Something went wrong. Please try again.");
          }
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Sign Up</button>
            
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>  Already have an account? <Link to="/signin">Sign in</Link></p>
      </form>
    );
  }