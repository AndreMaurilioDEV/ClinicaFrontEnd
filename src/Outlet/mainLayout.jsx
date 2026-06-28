import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  TbLayoutDashboard, TbCalendar, TbUsers, TbUserPlus, TbStethoscope, TbLogout
} from "react-icons/tb";
import { useAuth } from '../hooks/AuthProvider';
import './mainLayout.css';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: TbLayoutDashboard },
  { path: '/consultas', label: 'Agenda', icon: TbCalendar },
];

const DOUTORES_ITEMS = [
  { path: '/visualizar-doutores', label: 'Visualizar doutores', icon: TbUsers },
  { path: '/cadastro-doutor', label: 'Novo doutor', icon: TbUserPlus },
];

const PACIENTES_ITEMS = [
  { path: '/visualizar-pacientes', label: 'Visualizar pacientes', icon: TbUsers },
  { path: '/cadastro-paciente', label: 'Novo paciente', icon: TbUserPlus },
];

const getInitials = (email) => {
  if (!email) return '?';
  return email.substring(0, 2).toUpperCase();
};

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const [user, setUser] = useState("");

  useEffect(() => {
    const precisaTrocarSenha = localStorage.getItem("precisaTrocarSenha") === "true";
    if (precisaTrocarSenha) {
      navigate("/redefinir-senha-obrigatoria");
      return;
    }
    const userData = localStorage.getItem("emailUser");
    setUser(userData);
  }, []);

  const handleLogout = () => {
    auth.logOut();
  };

  const isActive = (path) => location.pathname === path;

  const renderItem = ({ path, label, icon: Icon }) => (
    <div
      key={path}
      className={`menu-item ${isActive(path) ? 'menu-item-active' : ''}`}
      onClick={() => navigate(path)}
    >
      <Icon />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="main-content">
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <TbStethoscope />
          </div>
          <span>ClinicCenter</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(renderItem)}

          <div className="sidebar-section-label">Doutores</div>
          {DOUTORES_ITEMS.map(renderItem)}

          <div className="sidebar-section-label">Pacientes</div>
          {PACIENTES_ITEMS.map(renderItem)}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-avatar">{getInitials(user)}</div>
          <div className="sidebar-user-email" title={user}>{user}</div>
          <button onClick={handleLogout} className="sidebar-logout-btn" aria-label="Sair">
            <TbLogout />
          </button>
        </div>

      </aside>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;