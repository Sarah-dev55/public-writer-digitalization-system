import React, { createContext, useState, useEffect } from 'react';
import LoginModal from '../components/ui/LoginModal';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import { getErrorMessage } from '../utils/errorUtils';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // Get the user data from the browser's storage
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  });
  // Get the secret login token
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  // Show or hide the login window
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  // Keep track of what the user wanted to do before logging in
  const [pendingAction, setPendingAction] = useState(null);

  // Save the token to the browser when it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Save the user data to the browser when it changes
  useEffect(() => {
    try {
      if (user) localStorage.setItem('user', JSON.stringify(user));
      else localStorage.removeItem('user');
    } catch (err) {}
  }, [user]);

  // Open the login window and remember what to do next
  const openLogin = (action) => {
    setPendingAction(() => action || null);
    setLoginModalOpen(true);
  };

  // Close the login window
  const closeLogin = () => {
    setLoginModalOpen(false);
    setPendingAction(null);
  };

  // Try to log in with email and password
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

  // Try to sign up for a new account
  const signup = async (payload) => {
    const res = await authService.signup(payload);
    if (res && res.success) {
      setToken(res.token);
      setUser(res.data || null);
      return { success: true };
    }
    return res;
  };

  // Change the user's name or phone number
  const updateProfile = async (data) => {
    try {
      if (!user) return { success: false, message: 'No user logged in' };
      const userId = user._id || user.id;
      // Send the new data to the server
      const res = await userService.updateUser(userId, data);
      
      // Update the user data in our app
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

  // Refresh the user data from the server
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

  // Log out of the account
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // just ignore if it fails
    }
    setToken(null);
    setUser(null);
  };

  // Check if someone is logged in before doing something
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