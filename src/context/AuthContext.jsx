import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to restore user:", error);
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = (userData, tokens = null) => {
    // Save user
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    // Save JWT tokens
    if (tokens?.access) {
      localStorage.setItem(
        "access_token",
        tokens.access
      );
    }

    if (tokens?.refresh) {
      localStorage.setItem(
        "refresh_token",
        tokens.refresh
      );
    }

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;