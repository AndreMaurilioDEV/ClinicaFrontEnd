import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css'
import { useAuth } from "../../hooks/AuthProvider";
import {
  TbStethoscope, TbMail, TbLock, TbEye, TbEyeOff,
  TbCalendarStats, TbShieldLock, TbChartBar, TbAlertCircle
} from "react-icons/tb";

function Login() {

  const [formLogin, setFormLogin] = useState({
    username: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [erro, setErro] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    { target },
  ) => {
    const { name: targetName, value } = target;
    setFormLogin({ ...formLogin, [targetName]: value })
  };

  const { username, password } = formLogin;
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErro("");
    try {
      await auth.loginAction(formLogin);
      localStorage.setItem("emailUser", formLogin.username)
      return;
    } catch (error) {
      console.error('Erro ao enviar dados do formulário:', error);
      setErro("Email ou senha inválidos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-outer">
      <div className="login-card-wrapper">

        <div className="login-brand-panel">
          <div className="login-brand-overlay"></div>
          <div className="login-decor-circle login-decor-circle-1"></div>
          <div className="login-decor-circle login-decor-circle-2"></div>

          <div className="login-brand-content">
            <div className="login-brand-header">
              <div className="login-brand-icon">
                <TbStethoscope />
              </div>
              <span>ClinicCenter</span>
            </div>

            <p className="login-brand-text">
              Gestão completa de pacientes, agendamentos e profissionais em um só lugar.
            </p>

            <div className="login-brand-divider"></div>

            <ul className="login-benefits">
              <li>
                <span className="login-benefit-icon"><TbCalendarStats /></span>
                Agendamentos inteligentes
              </li>
              <li>
                <span className="login-benefit-icon"><TbShieldLock /></span>
                Prontuários seguros
              </li>
              <li>
                <span className="login-benefit-icon"><TbChartBar /></span>
                Relatórios e métricas
              </li>
            </ul>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-card">
            <div className="login-form-header">
              <h2>Bem-vindo de volta</h2>
              <p>Informe seus dados para acessar sua conta</p>
            </div>

            {erro && (
              <div className="login-erro">
                <TbAlertCircle />
                {erro}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit()
              }}
              className="form-login"
            >
              <label htmlFor="user-inp">
                <span className="span-input">Email</span>
                <div className="login-input-wrapper">
                  <TbMail />
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    id="user-inp"
                    placeholder="nome@clinica.com"
                    required
                  />
                </div>
              </label>

              <label htmlFor="password-inp">
                <span className="span-input">Senha</span>
                <div className="login-input-wrapper">
                  <TbLock />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleChange}
                    id="password-inp"
                    required
                  />
                  <button
                    type="button"
                    className="login-toggle-senha"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <TbEyeOff /> : <TbEye />}
                  </button>
                </div>
              </label>

              <button className="login-submit-btn" disabled={password.length == 0 || isSubmitting}>
                {isSubmitting ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="login-divisor">
              <span>ou</span>
            </div>

            <span className="login-esqueci" onClick={() => navigate('/esqueci-senha')}>
              Esqueci minha senha
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;