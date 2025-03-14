import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css'
import { useEffect } from "react";
import { useAuth } from "../../hooks/AuthProvider";

function Login() {

  const [formLogin, setFormLogin] = useState({
    username: "",
    password: ""
  });

  const handleChange = (
    { target },
  ) => {
    const {name: targetName, value} = target;
    setFormLogin({...formLogin, [targetName]: value})
  };

  const {username, password} = formLogin;
  const navigate = useNavigate();
  const auth = useAuth()

  const handleSubmit = async () => {
    try {
      await auth.loginAction(formLogin);
      localStorage.setItem("emailUser", formLogin.username)
      return;
    } catch (error) {
      console.error('Erro ao enviar dados do formulário:', error);
    }
  };

  return (
    <>
    <div className="div-box-flex">
    <div className="background-section"></div>
    <section className="sec-login">
      <div className="header-sec-login">
        <h2>Login</h2>
        <p>Informe e-mail e senha</p>
      </div>
      <div className="options-login">
        <div>
          <button>Funcionário</button>
          <button>Administrador</button>
        </div>
      </div>
   <form
   onSubmit={ (e) => {
      e.preventDefault();
      handleSubmit()
   }}
   className="form-login"
   >
    <label htmlFor="user-inp">
      <span className="span-input">email</span>
      <input 
      type="text"
      name="username"
      value={username}
      onChange={ handleChange }
      id="user-inp" 
      />
    </label>

    <label htmlFor="password-inp">
      <span className="span-input">senha</span>
      <input 
      type="password"
      name="password"
      value={password}
      onChange={ handleChange }
      id="password-inp" 
      />
    </label>

    <button
    disabled={formLogin.password.length == 0}
    >
      ENTRAR
    </button>
   </form>
   <span onClick={() => navigate('/esqueci-senha')}>Esqueci minha senha</span>
    </section>
    </div>
    </>
  );
}

export default Login;