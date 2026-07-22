import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { hasPermission } from '../utils/permissions';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', {
      email,
      password,
    });

    const { token, user: userData } = res.data.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser(userData);

    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    delete api.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['Authorization'];

    setUser(null);
  };

  /**
   * Check if the current user has a specific permission.
   * @param {string} permission - Permission string (e.g. 'CUSTOMER.CREATE')
   * @returns {boolean}
   */
  const can = (permission) => {
    if (!user || !permission) return false;
    return hasPermission(user.role, permission);
  };

  /**
   * Check if the current user has a specific role.
   * @param {string} role - Role to check (e.g. 'ADMIN')
   * @returns {boolean}
   */
  const isRole = (role) => {
    if (!user || !role) return false;
    return user.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        can,
        isRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
