import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

const ENDPOINTS = {
  TOKEN: "/api/auth/token/",
  REFRESH: "/api/auth/token/refresh/",
  ME: "/api/auth/me/",
};

function saveTokens({ access, refresh }) {
  if (access) localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
}

function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

async function refreshAccess() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) throw new Error("No refresh token");

  const data = await api(ENDPOINTS.REFRESH, {
    method: "POST",
    body: JSON.stringify({ refresh }),
    auth: false,
  });

  if (!data?.access) throw new Error("Refresh failed");
  localStorage.setItem("access", data.access);
  return data.access;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  const loadMe = async () => {
    // token না থাকলে ME call করবো না
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    if (!access && !refresh) {
      setUser(null);
      return null;
    }

    try {
      const me = await api(ENDPOINTS.ME, { method: "GET" });
      setUser(me);
      return me;
    } catch (e) {
      try {
        await refreshAccess();
        const me2 = await api(ENDPOINTS.ME, { method: "GET" });
        setUser(me2);
        return me2;
      } catch {
        setUser(null);
        clearTokens();
        return null;
      }
    }
  };

  useEffect(() => {
    (async () => {
      await loadMe();
      setBooting(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async ({ username, password }) => {
    const tokens = await api(ENDPOINTS.TOKEN, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      auth: false,
    });

    saveTokens(tokens);

    const me = await api(ENDPOINTS.ME, { method: "GET" });
    setUser(me);
    return me;
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      booting,
      login,
      logout,
      reloadMe: loadMe,
      access: localStorage.getItem("access") || "",
    }),
    [user, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}