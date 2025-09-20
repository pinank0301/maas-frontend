import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';

interface User {
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const isLoggingOut = useRef(false);

  useEffect(() => {
    // Check if access token exists in localStorage
    const checkAuthStatus = () => {
      // Don't check if we're in the middle of logging out
      if (isLoggingOut.current) {
        console.log('Currently logging out, skipping auth check');
        return;
      }
      
      const token = localStorage.getItem('authToken');
      console.log('Checking auth status, token:', token, 'current path:', window.location.pathname);
      
      // Don't redirect if we're already on login page
      if (window.location.pathname === '/login') {
        console.log('Already on login page, skipping redirect');
        return;
      }
      
      if (token) {
        const userData = localStorage.getItem('userData');
        if (userData) {
          try {
            setUser(JSON.parse(userData));
            console.log('User authenticated');
          } catch (error) {
            // Invalid user data, clear everything and redirect
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            console.log('Invalid user data, redirecting to login');
            navigate('/login');
          }
        } else {
          // No user data, clear token and redirect
          localStorage.removeItem('authToken');
          console.log('No user data, redirecting to login');
          navigate('/login');
        }
      } else {
        // No token, redirect to login
        console.log('No token, redirecting to login');
        navigate('/login');
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    const userData = {
      fullName: response.data.fullName,
      email: response.data.email
    };
    setUser(userData);
    localStorage.setItem('authToken', response.data.accessToken);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('Logging out...');
    isLoggingOut.current = true;
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    console.log('Cleared localStorage, redirecting...');
    // Use window.location for immediate redirect
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
