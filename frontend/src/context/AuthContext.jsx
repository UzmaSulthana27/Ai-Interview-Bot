import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser  = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsed);
      } catch (_) {}
    }
    setIsLoading(false);
  }, []);

  /* ---------- helpers ---------- */
  const _persist = (userData, authToken) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    // store flat keys used by interview/history endpoints
    const id   = userData?.id ?? userData?.userId ?? '';
    const name = userData?.fullName ?? userData?.name ?? '';
    if (id)   localStorage.setItem('userId',   String(id));
    if (name) localStorage.setItem('userName', name);
  };

  /* ---------- actions ---------- */
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    _persist(userData, authToken);
    setError(null);
  };

  const signup = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    _persist(userData, authToken);
    setError(null);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    [
      'authToken', 'user', 'userId', 'userName', 'jobRole',
      'isPremium', 'sessionsUsed', 'sessionsLeft'
    ].forEach(k => localStorage.removeItem(k));
    setError(null);
  };

  /** Merge fields into the current user and persist to localStorage (e.g. after saving bio). */
  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      const authToken = localStorage.getItem('authToken');
      if (authToken) _persist(next, authToken);
      return next;
    });
  }, []);

  const setAuthError = (err) => setError(err);

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user, token, isLoading, error,
      isAuthenticated,
      login, signup, logout, setAuthError, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
