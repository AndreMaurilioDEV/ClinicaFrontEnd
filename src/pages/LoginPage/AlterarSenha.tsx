import { useState } from "react";
import React from 'react';
import { fetchChangePassword } from "../../api/api";
import { useAuth } from "../../hooks/AuthProvider";
import { useSnackbar } from "notistack";
import { AxiosError } from "axios";
import './AlterarSenha.css';

interface AlterarSenhaProps {
  obrigatorio?: boolean;
}

function AlterarSenha({ obrigatorio = false }: AlterarSenhaProps) {

  const [formPassword, setFormPassword] = useState({
    oldPassword: "",
    newPassword: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { concluirTrocaSenhaObrigatoria, logOut } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (
    { target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name: targetName, value } = target;
    setFormPassword({ ...formPassword, [targetName]: value })
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const email = localStorage.getItem("emailUser") || "";
      await fetchChangePassword({
        email,
        oldPassword: formPassword.oldPassword,
        newPassword: formPassword.newPassword
      });
      enqueueSnackbar("Senha alterada com sucesso!", { variant: "success" });
      if (obrigatorio) {
        concluirTrocaSenhaObrigatoria();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data?.message || "Erro ao alterar a senha. Verifique a senha atual.";
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="div-flex-center">
      <section className="sec-form">
        {obrigatorio && (
          <div className="aviso-troca-obrigatoria">
            <p>Por segurança, você precisa trocar sua senha antes de continuar.</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="user-inp">
            <span className="span-input">Senha Atual:</span>
            <input
              type="password"
              name="oldPassword"
              value={formPassword.oldPassword}
              onChange={handleChange}
              id="user-inp"
              required
            />
          </label>

          <label htmlFor="password-inp">
            <span className="span-input">Nova Senha:</span>
            <input
              type="password"
              name="newPassword"
              value={formPassword.newPassword}
              onChange={handleChange}
              id="password-inp"
              required
              minLength={8}
            />
          </label>

          <button
            type="submit"
            disabled={formPassword.oldPassword.length === 0 || formPassword.newPassword.length === 0 || isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Confirmar"}
          </button>
        </form>

        {obrigatorio && (
          <span onClick={logOut}>Sair</span>
        )}
      </section>
    </div>
  )
};

export default AlterarSenha;