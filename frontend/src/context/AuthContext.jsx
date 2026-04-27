import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    console.log('Checking auth, token exists:', !!token);
    if (token) {
      try {
        const res = await authAPI.getUser();
        console.log('Auth check successful, user:', res.data);
        setUser(res.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
      }
    } else {
      console.log('No token found');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const token = response.data.token;
    localStorage.setItem('token', token);

    const userResponse = await authAPI.getUser();
    setUser(userResponse.data);
    return response;
  };

  const register = async (name, email, password) => {
    const response = await authAPI.register({ name, email, password });
    const token = response.data.token;
    localStorage.setItem('token', token);

    const userResponse = await authAPI.getUser();
    setUser(userResponse.data);
    return response;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Continue with logout even if API fails
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};