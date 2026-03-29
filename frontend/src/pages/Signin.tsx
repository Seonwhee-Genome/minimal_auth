import { useState } from "react";
import { signin } from "../api/auth.ts";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
        setError("Please fill in all fields");
        return;
      }
  
      setError("");
      setLoading(true);
      try {
          const res = await signin({ username, password });
          login(res.data.token); // backend returns token
          navigate("/profile");
      } catch (err: any) {
          if (err.response?.status === 401) {
              setError("Invalid username or password");
          } else {
              setError("Something went wrong. Please try again.");
          }
      } finally {
        setLoading(false); // always reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </form>
  );
}