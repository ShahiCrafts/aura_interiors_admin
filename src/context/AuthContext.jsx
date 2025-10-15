import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../service/authService";

// AuthContext will hold all auth-related states and functions.
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export let setTokenInState = (token) => {};
export let signOut = () => {};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  setTokenInState = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  signOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const signIn = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { user: userData, tokens } = await authService.login({
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);

      setUser(userData);
      setToken(tokens.accessToken);
      setIsAuthenticated(true);

      return userData;
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      signOut();
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
