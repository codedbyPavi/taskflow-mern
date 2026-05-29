import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { getApiReachabilityMessage } from "../api/healthCheck";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/api/auth/me");
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success("Welcome back");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.request && !err.response ? await getApiReachabilityMessage(err) : "Login failed");
      toast.error(message);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success("Account created");
    } catch (err) {
      const apiMessage =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        (err.request && !err.response ? await getApiReachabilityMessage(err) : null) ||
        "Registration failed";
      toast.error(apiMessage);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  };

  const value = useMemo(() => ({ user, token, isLoading, login, register, logout }), [user, token, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
