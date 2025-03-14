import axios, { AxiosResponse } from 'axios';
import { CommonData } from '../interface/Interfaces';
export const API_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
  }
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
    const axiosConfig = { headers: { 'Content-Type': 'application/json' } };
    await axios.post(API_URL + endpoint, payload, axiosConfig);
  } catch (error) {
    console.error('Erro ao enviar dados do formulário:', error);
  }
};

export const fetchGet = async (endpoint: string) => {
  try {
    const axiosConfig = { headers: { 'Content-Type': 'application/json' } };
    const response = await axios.get(`${API_URL}/${endpoint}`, axiosConfig);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};

export const fetchStatus = async (id: number, endpoint: string, payload: object) => {
  try {
    const axiosConfig = { headers: { 'Content-Type': 'application/json' } };
    const response = await axios.put(`${API_URL}/${endpoint}/${id}`, payload, axiosConfig);
    console.log('Status da consulta atualizado com sucesso:', response.data);
  } catch (error) {
    console.error('Erro ao atualizar o status da consulta:', error);
  }
};

export const fetchDelete = async (endpoint: string, id: number) => {
  try {
    const axiosConfig = { headers: { 'Content-Type': 'application/json' } };
    await axios.delete(`${API_URL}/${endpoint}/${id}`, axiosConfig);
    console.log('Item excluído com sucesso:', id);
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