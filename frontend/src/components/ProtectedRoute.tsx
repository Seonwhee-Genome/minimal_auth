import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

export default function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}