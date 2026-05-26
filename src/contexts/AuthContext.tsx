import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../api/axios';

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('user_role'));

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { access_token } = res.data;
    // Декодируем роль из токена (без библиотеки)
    const payload = JSON.parse(atob(access_token.split('.')[1]));
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user_role', payload.role);
    setToken(access_token);
    setRole(payload.role);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);