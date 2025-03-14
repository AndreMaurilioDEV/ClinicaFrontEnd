import { useState } from "react";
import React from 'react';
import { fetchRequestResetPassword } from "../../api/api"; // Corrigido nome da função
import { AxiosError } from "axios";
import "./RedefinicaoRequest.css";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { useSnackbar } from "notistack";

function RedefinicaoRequest() {
  const [form, setForm] = useState({ email: "" });
  const navigate = useNavigate();
  const { api } = useAuth();
  const {  enqueueSnackbar } = useSnackbar();

  const handleChange = (
    { target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", {email: form.email})
      enqueueSnackbar("Um código para redefinição foi enviado ao seu e-mail!!", {variant: "success"})
      setForm({ email: "" });
      navigate('/verificacao');
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data.message;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <div className="div-flex-center">
      <section className="sec-form">
       
        <p>Informe seu Email</p>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <button type="submit">Enviar Código</button>
        </form>
        <span>Voltar</span>
      </section>
    </div>
  );
}

export default RedefinicaoRequest;
