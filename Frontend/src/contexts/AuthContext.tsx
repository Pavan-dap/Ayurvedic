// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { apiService } from '../services/api';

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   is_staff: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   loading: boolean;
//   login: (username: string, password: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const isAuthenticated = !!user;

//   useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       // Validate token and get user info
//       apiService.setAuthToken(token);
//       // For demo purposes, set a mock user
//       setUser({
//         id: 1,
//         username: 'admin',
//         email: 'admin@ayurvedicerp.com',
//         first_name: 'System',
//         last_name: 'Administrator',
//         is_staff: true
//       });
//     }
//     setLoading(false);
//   }, []);

//   const login = async (username: string, password: string): Promise<void> => {
//     try {
//       const response = await apiService.post('/auth/login/', { username, password });
//       const { access, refresh } = response.data;
      
//       localStorage.setItem('accessToken', access);
//       localStorage.setItem('refreshToken', refresh);
//       apiService.setAuthToken(access);
      
//       // For demo purposes, set mock user data
//       const userData: User = {
//         id: 1,
//         username: username,
//         email: 'admin@ayurvedicerp.com',
//         first_name: 'System',
//         last_name: 'Administrator',
//         is_staff: true
//       };
      
//       setUser(userData);
//     } catch (error: any) {
//       throw new Error(error.response?.data?.detail || 'Login failed');
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     apiService.setAuthToken(null);
//     setUser(null);
//   };

//   const value: AuthContextType = {
//     user,
//     isAuthenticated,
//     loading,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import { jwtDecode } from "jwt-decode";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDemo: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const isAuthenticated = !!user;

  // 🔑 Check stored token on reload and fetch user from backend (demo token supported)
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }
      if (token === 'demo-token') {
        setIsDemo(true);
        apiService.setAuthToken(null);
        setUser({
          id: 0,
          username: 'demo',
          email: '',
          first_name: 'Demo',
          last_name: 'User',
          is_staff: true,
        });
        setLoading(false);
        return;
      }
      try {
        apiService.setAuthToken(token);
        const decoded: any = jwtDecode(token);
        const userId = decoded.user_id;
        const userResponse = await apiService.get(`/users/${userId}/`);
        setUser(userResponse);
      } catch (e) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        apiService.setAuthToken(null);
        setUser(null);
      } finally {
        setIsDemo(false);
        setLoading(false);
      }
    };
    init();
  }, []);

  // 🔐 Login
  const login = async (username: string, password: string): Promise<void> => {
    try {
      const { access, refresh } = await apiService.post('/auth/login/', { username, password });

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      apiService.setAuthToken(access);

      const decoded: any = jwtDecode(access);
      const userId = decoded.user_id;
      console.log("Decoded JWT:", decoded);

      // Fetch real user info from backend
      const userResponse = await apiService.get(`/users/${userId}/`);
      setUser(userResponse);
      setLoading(false);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    apiService.setAuthToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isDemo,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
