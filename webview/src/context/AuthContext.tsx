import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import type { AuthResponse, User } from '../types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (token && refreshToken) {
        try {
          const userData = await authAPI.verifyToken(token);
          setUser(userData);
        } catch (error) {
          console.error('Token verification failed:', error);
          // Try to refresh the token
          try {
            const { access } = await authAPI.refreshToken(refreshToken);
            localStorage.setItem('access_token', access);
            setAccessToken(access);
            
            const userData = await authAPI.getCurrentUser();
            setUser(userData);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            logout();
          }
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    const { user: userData, access, refresh }: AuthResponse = await authAPI.login(username, password);
    setUser(userData);
    setAccessToken(access);
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  };

  const register = async (userData: any) => {
    const { user, access, refresh }: AuthResponse = await authAPI.register(userData);
    setUser(user);
    setAccessToken(access);
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const value = {
    user,
    accessToken,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};