import axios, { AxiosResponse } from 'axios';
import { CommonData } from '../interface/Interfaces';
export const API_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export const fetchData = async <T extends CommonData>(
  endpoint: string,
  id?: number
): Promise<AxiosResponse<T[]>> => {
  try {
    const url = id ? `${API_URL}/${endpoint}/${id}` : `${API_URL}/${endpoint}`;
    const response = await api.get(url);
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const fetchPost = async (payload: object, endpoint: string) => {
  try {
    //const axiosConfig = { headers: { 'Content-Type': 'application/json' } };
    const response = await api.post(endpoint, payload);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.status);
      console.log(error.response?.data);
    }

    throw error;
  }
};

export const fetchGet = async (endpoint: string) => {
  try {
    //const axiosConfig = { headers: { 'Content-Type': 'application/json' } };
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};

export const fetchStatus = async (id: number, endpoint: string, payload: object) => {
  try {
    const response = await api.put(`${endpoint}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar o status da consulta:', error);
  }
};

export const fetchDelete = async (endpoint: string, id: number) => {
  try {
    const response = await api.delete(`${endpoint}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir item:', error);
  }
};

export const fetchRequestResetPassword = async ( payload: object) => {
  try {
    const axiosConfig = { headers: { 'Content-Type': 'application/json' } };
    await axios.post(`${API_URL}/auth/forgot-password`, payload, axiosConfig);
  } catch (error) {
    console.error(error);
  }
}

export const fetchValidResetToken = async (payload: object) => {
  try {
    const axiosConfig = { headers: { 'Content-Type': 'application/json' } };
    const response = await axios.post(`${API_URL}/auth/validate-reset-token`, payload, axiosConfig);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

export const fecthResetPassword = async (payload: object) => {
  try {
    const axiosConfig = { headers: { 'Content-Type': 'application/json' } };
    await axios.post(`${API_URL}/auth/reset-password`, payload, axiosConfig);
  } catch (error) {
    console.error(error);
  }
}

export const fetchChangePassword = async (payload: object) => {
  try {
    const axiosConfig = { headers: { 'Content-Type': 'application/json' } };
    await axios.put(`${API_URL}/auth/change-password`, payload, axiosConfig);
  } catch (error) {
    console.error(error)
  }
}

export const fetchLogin = async (payload: object) => {
  try {
    const axiosConfig = { headers: { 'Content-Type': 'application/json' } };
    const response = await axios.post(`${API_URL}/auth/login`, payload, axiosConfig);
    return response;
  } catch (error) {
    console.error(error)
    throw error;
  }
}