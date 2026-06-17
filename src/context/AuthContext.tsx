/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable react-refresh/only-export-components */
import axios, { type AxiosInstance } from 'axios';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  isAuth: boolean;
  userName: string | null;
  user: ProfileResponse | null;
  login: (token: string, name: string) => void; 
  logout: () => void;
  updateProfile: () => Promise<void>;
}

export interface ProfileResponse {
  id: string,
  createTime: string,
  name: string,
  birthday: string,
  gender: string,
  email: string,
  phone: string
  speciality?: {
    id: string;
    name: string;
  };
}

const api: AxiosInstance = axios.create({
  baseURL: 'https://mis-api.kreosoft.space/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authApi = {
  // ... login, register ...
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>('/doctor/profile');
    return response.data;
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean>(!!localStorage.getItem('token'));
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));
  const [user, setUser] = useState<ProfileResponse | null>(null);

  const updateProfile = useCallback(async () => {
    console.log("trying to do that ...")
    try {
      const profile = await authApi.getProfile();
      localStorage.setItem('userName', profile.name);
      setUserName(profile.name);
      setUser(profile);
      setIsAuth(true);
    } catch (error) {
      console.error("Ошибка загрузки профиля", error);
      logout();
    }
  }, []);

  const login = (token: string, name: string) => {
    localStorage.setItem('token', token);
    console.log("trying to do that ... #2")

    // localStorage.setItem('userName', name);
    setIsAuth(true);
    setUserName(name);
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsAuth(false);
    setUserName(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      updateProfile();
    }
  }, [updateProfile]);

  return (
    <AuthContext.Provider value={{ isAuth, userName, user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth должен быть использован внутри AuthProvider');
  return context;
};