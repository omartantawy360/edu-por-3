import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser({ ...parsed, id: parsed._id });
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
        const { data } = await api.post('/auth/login', { email, password });
        const userToStore = { ...data, id: data._id };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userToStore));
        setUser(userToStore);
        return { success: true };
    } catch (error) {
        console.error("Login failed", error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Login failed',
          errors: error.response?.data?.errors
        };
    } finally {
        setLoading(false);
    }
  };

  const register = async (name, email, password, role, school, otp) => {
    setLoading(true);
    try {
        const { data } = await api.post('/auth/register', { name, email, password, role, school, otp });
        const userToStore = { ...data, id: data._id };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userToStore));
        setUser(userToStore);
        return { success: true, data: userToStore };
    } catch (error) {
        console.error("Registration failed", error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Registration failed',
          errors: error.response?.data?.errors
        };
    } finally {
        setLoading(false);
    }
  };

  const sendOtp = async (email) => {
    setLoading(true);
    try {
        const { data } = await api.post('/auth/send-otp', { email });
        return { success: true, message: data.message };
    } catch (error) {
        console.error("Failed to send OTP", error);
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to send verification code',
          errors: error.response?.data?.errors
        };
    } finally {
        setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Forgot password request failed", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to request password reset',
        errors: error.response?.data?.errors
      };
    } finally {
      setLoading(false);
    }
  };

  const resetUserPassword = async (email, otp, newPassword) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { email, otp, newPassword });
      return { success: true, message: data.message };
    } catch (error) {
      console.error("Password reset failed", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reset password',
        errors: error.response?.data?.errors
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, sendOtp, forgotPassword, resetUserPassword, loading }}>
        {!initialLoading && children}
    </AuthContext.Provider>
  );
};
