// @ts-nocheck
/**
 * Custom Authentication Hook
 * Manages authentication state using custom auth service
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { CustomAuthService, User, AuthResponse } from '@/services/customAuthService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, fullName?: string, avatarUrl?: string, age?: number, institution?: string, userRole?: 'student' | 'teacher' | 'admin') => Promise<AuthResponse>;
  verifyEmail: (email: string, code: string) => Promise<AuthResponse>;
  requestPasswordReset: (email: string) => Promise<AuthResponse>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useCustomAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useCustomAuth must be used within an AuthProvider');
  }
  return context;
};

export const CustomAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      if (CustomAuthService.isAuthenticated()) {
        const response = await CustomAuthService.validateSession();
        if (response.success && response.user) {
          setUser(response.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await CustomAuthService.login(email, password);
    
    if (response.success && response.user) {
      setUser(response.user);
      setIsAuthenticated(true);
    }
    
    return response;
  };

  const register = async (
    email: string, 
    password: string, 
    fullName?: string,
    avatarUrl?: string,
    age?: number,
    institution?: string,
    userRole?: 'student' | 'teacher' | 'admin'
  ): Promise<AuthResponse> => {
    return await CustomAuthService.register(email, password, fullName, avatarUrl, age, institution, userRole);
  };

  const verifyEmail = async (email: string, code: string): Promise<AuthResponse> => {
    return await CustomAuthService.verifyEmail(email, code);
  };

  const requestPasswordReset = async (email: string): Promise<AuthResponse> => {
    return await CustomAuthService.requestPasswordReset(email);
  };

  const resetPassword = async (
    email: string, 
    code: string, 
    newPassword: string
  ): Promise<AuthResponse> => {
    return await CustomAuthService.resetPassword(email, code, newPassword);
  };

  const logout = async (): Promise<void> => {
    await CustomAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshAuth = async (): Promise<void> => {
    await checkAuthStatus();
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    logout,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};