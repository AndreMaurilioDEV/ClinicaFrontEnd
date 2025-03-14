import './RedefinicaoRequest.css';
import React from 'react';
import { useState } from 'react';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { fetchValidResetToken } from '../../api/api';
import Alert from '@mui/material/Alert';
import { useAuth } from '../../hooks/AuthProvider';
import { useSnackbar } from 'notistack';
import {AxiosError} from 'axios';

function ConfirmarRedefinicao() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { api } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      token: otp
    }
    try {
      await api.post("/auth/validate-reset-token", payload);
      enqueueSnackbar("Código confirmado", { variant: "success" })
      navigate('/redefinir-senha')
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data.message;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <div className="div-flex-center">
      <section className="sec-form">
        <div className='div-verificacao'>
          <p style={{
            fontSize: '1rem'
          }}>Informe o código para redefinir sua senha</p>
          <span style={{
            fontSize: '0.8rem',
            color: 'gray',
            textAlign: 'center',
            margin: '0'
          }}>O código foi enviado para o seu email</span>
        </div>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            containerStyle={{
              justifyContent: 'center'
            }}
          />
          <button type='submit'>Confirmar</button>
        </form>
        <span onClick={() => navigate('/esqueci-senha')}>Eu não tenho o código</span>
      </section>
    </div>
  )
};

export default ConfirmarRedefinicao;