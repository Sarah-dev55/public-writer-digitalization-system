import React, { createContext, useState } from "react";
import LoginModal from "../components/ui/LoginModal";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const openLogin = (action) => {
    setPendingAction(() => action || null);
    setLoginModalOpen(true);
  };

  const closeLogin = () => {
    setLoginModalOpen(false);
    setPendingAction(null);
  };

  const login = (credentials) => {
    setIsAuthenticated(true);
    setLoginModalOpen(false);
    try {
      if (typeof pendingAction === "function") {
        pendingAction();
      }
    } finally {
      setPendingAction(null);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const requireAuth = (action) => {
    if (isAuthenticated) {
      if (typeof action === "function") action();
    } else {
      openLogin(action);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, requireAuth, openLogin, closeLogin }}
    >
      {children}
      <LoginModal open={loginModalOpen} onClose={closeLogin} onLogin={login} />
    </AuthContext.Provider>
  );
};

export default AuthProvider;