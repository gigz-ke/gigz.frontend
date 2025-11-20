import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContextObject";
import type { LoginDTO, User } from "../data/models/User";
import { getUserByEmail, loginUser, logoutUser, refreshToken } from "../data/services/userService";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const saveTokens = (tokens: { accessToken: string; refreshToken: string }) => {
    setAccessToken(tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  };

  const login = async (data: LoginDTO) => {
    const response = await loginUser(data);
    saveTokens(response);
    const payload = JSON.parse(atob(response.accessToken.split(".")[1]));
    const dbUser = await getUserByEmail(payload.email);
    setUser(dbUser);
  };

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) await logoutUser(refreshToken);

    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setUser(null);
  }, []);

  const handleRefreshToken = useCallback(async () => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) return null;

    try {
      const tokens = await refreshToken(storedRefresh);
      saveTokens(tokens);
      const payload = JSON.parse(atob(tokens.accessToken.split(".")[1]));
      const dbUser = await getUserByEmail(payload.email);
      setUser(dbUser);
      return tokens.accessToken;
    } catch {
      await logout();
      return null;
    }
  }, [logout]);

  useEffect(() => {
    const init = async () => {
      await handleRefreshToken();
      setLoading(false);
    };
    init();
  }, [handleRefreshToken]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      async error => {
        if (error.response?.status === 401) {
          const newToken = await handleRefreshToken();
          if (newToken) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return axios(error.config);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [handleRefreshToken]);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
