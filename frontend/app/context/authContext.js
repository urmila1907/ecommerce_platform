"use client";
import { createContext, useContext, useState, useEffect } from "react";

// Create Auth Context
const AuthContext = createContext();

// AuthProvider Component
export function AuthProvider({ children }) {
  const [isUser, setIsUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const res = await fetch("/api/auth/check", {
          method: "GET",
          credentials: "include",  
        });
        const data = await res.json();
        setIsUser(data.isUser);
      } catch (error) {
        console.error("Auth check failed:", error);
      }finally {
        setLoading(false);
      }
    }
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isUser, setIsUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook to Use Context
export function useAuth() {
  return useContext(AuthContext);
}
