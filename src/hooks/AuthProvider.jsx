import { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, fetchLogin } from '../api/api';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');
  const navigate = useNavigate();
  
  const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
  });

  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  const loginAction = async (data) => {
    try {
      const response = await api.post('/auth/login', data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem("authToken", response.data.token);
        navigate("/dashboard");
        return response;
      }
      throw new Error(response.message);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("authToken");
    localStorage.removeItem("emailUser");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;