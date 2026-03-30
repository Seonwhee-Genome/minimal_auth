import { createContext, useContext, useState } from "react";
import { signout } from "../api/auth.ts";

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = async () => {
    try {        
        // ---------------------------------------------
        // Notify backend to invalidate token/session
        // Token is automatically attached by interceptor
        // ---------------------------------------------
        await signout();
    } catch (e) {        
        // ---------------------------------------------
        // Even if API call fails (e.g., token expired),
        // proceed with local logout to ensure UX consistency
        // ---------------------------------------------
        console.warn("Signout failed (ignored)");
    } finally {
        localStorage.removeItem("token");
        setToken(null);
    }    
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;