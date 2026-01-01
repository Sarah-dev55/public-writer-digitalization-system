import React, { createContext, useState, useEffect } from 'react';
import LoginModal from '../components/ui/LoginModal';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import { getErrorMessage } from '../utils/errorUtils';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      else localStorage.removeItem('user');
    } catch (err) {}
  }, [user]);

  const openLogin = (action) => {
    setPendingAction(() => action || null);
    setLoginModalOpen(true);
  };

  const closeLogin = () => {
    setLoginModalOpen(false);
    setPendingAction(null);
  };

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res && res.success) {
      setToken(res.token);
      setUser(res.data || null);
      setLoginModalOpen(false);
      if (typeof pendingAction === 'function') pendingAction();
      setPendingAction(null);
    }
    return res;
  };

  const signup = async (payload) => {
    const res = await authService.signup(payload);
    if (res && res.success) {
      setToken(res.token);
      setUser(res.data || null);
      return { success: true };
    }
    return res;
  };

  const updateProfile = async (data) => {
    try {
      if (!user) return { success: false, message: 'No user logged in' };
      const userId = user._id || user.id;
      // Use clientUserService for client roles
      const res = user.role === 'admin' 
        ? await userService.updateUser(userId, data)
        : await userService.updateUser(userId, data); // Defaulting to userService for now, will check if need specific client service
      
      // Re-fetch to ensure consistency if needed, but userService returns the updated user.
      if (res) {
        setUser(prev => ({ ...prev, ...res }));
        return { success: true, data: res };
      }
      return { success: false, message: 'Update failed' };
    } catch (err) {
      console.error('Update profile error:', err);
      return { success: false, message: getErrorMessage(err) };
    }
  };

  const reloadUser = async () => {
    try {
      if (!user) return;
      const userId = user._id || user.id;
      const res = await userService.getUser(userId);
      if (res) {
        setUser(prev => ({ ...prev, ...res }));
      }
    } catch (err) {
      console.error('Reload user error:', err);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // ignore
    }
    setToken(null);
    setUser(null);
  };

  const requireAuth = (action) => {
    if (token) {
      if (typeof action === 'function') action();
    } else {
      openLogin(action);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, login, logout, signup, updateProfile, reloadUser, requireAuth, openLogin, closeLogin }}
    >
      {children}
      <LoginModal open={loginModalOpen} onClose={closeLogin} onLogin={login} />
    </AuthContext.Provider>
  );
};

export default AuthProvider;