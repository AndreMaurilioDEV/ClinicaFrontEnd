import { useContext, createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL, fetchLogin } from '../api/api';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  
    const loginAction = async (data) => {
      try {
    const response = await api.post('/auth/login', data, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data) {
     
      const precisaTrocarSenha = response.data.isConfirmed === false;
      localStorage.setItem("precisaTrocarSenha", String(precisaTrocarSenha));

      console.log(response.data)
      if (precisaTrocarSenha) {
        navigate("/redefinir-senha-obrigatoria");
      } else {
        navigate("/dashboard");
      }
      return response;
    }
      throw new Error(response.message);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const concluirTrocaSenhaObrigatoria = () => {
    localStorage.setItem("precisaTrocarSenha", "false");
    navigate("/dashboard");
  };

  const logOut = async () => {
    await api.post('/auth/logout');
    setUser(null);
    localStorage.removeItem("emailUser");
    localStorage.removeItem("precisaTrocarSenha");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{user, loginAction, logOut, api, concluirTrocaSenhaObrigatoria }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;