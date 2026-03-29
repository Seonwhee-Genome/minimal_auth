import { useEffect, useState } from "react";
import { getMe } from "../api/auth.ts";
import { useAuth } from "../context/AuthContext.tsx";

export default function Profile() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMe(token!);
        setUser(res.data);
      } catch (err) {
        console.error("Unauthorized");
      }
    };

    fetchMe();
  }, [token]);

  return (
    <div>
      <h2>My Profile</h2>
      {user && (
        <>          
          <p>Username: {user.username}</p>          
        </>
      )}
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}