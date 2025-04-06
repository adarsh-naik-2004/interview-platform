// src/contexts/AuthProvider.jsx
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // no token → skip check, go straight to not authenticated
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/api/auth/check');
        if (isMounted) setUser(data);
      } catch {
        // invalid/expired token
        localStorage.removeItem('token');
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);

      // now that token is set, fetch user
      const { data: userData } = await api.get('/api/auth/check');
      setUser(userData);

      toast.success('Login successful!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
      throw err;  // re‑throw so callers know it failed
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
