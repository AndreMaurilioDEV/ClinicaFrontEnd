import { Outlet, useNavigate } from 'react-router-dom';
import { IoIosNotificationsOutline } from "react-icons/io";
import { SlSettings } from "react-icons/sl";
import { CiHome } from "react-icons/ci";
import { TfiAgenda } from "react-icons/tfi";
import { MdOutlinePersonOutline, MdOutlineLogout, MdOutlineExpandMore } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { API_URL } from '../api/api';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../hooks/AuthProvider';

const MainLayout = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [user, setUser] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.logOut();
  }

  useEffect(() => {
    const fetchUser = async () => {
      const userData = localStorage.getItem("emailUser");
      setUser(userData);
    };

    fetchUser();
  }, []);


  console.log(user)



  return (
    <div className="main-content">
      <div className="menu">
        <div>
          <h1>ClinicCenter</h1>
        </div>
        <button onClick={() => navigate('/consultas')} className='button-geral-class'>Novo agendamento</button>

        <div className='div-flex-menu-option'>
          <CiHome />
          <h3 onClick={() => navigate('/dashboard')}>
            Dashboard</h3>
        </div>

        <div className='div-flex-menu-option'>
          <TfiAgenda />
          <h3 onClick={() => navigate('/consultas')}>
            Agenda
          </h3>
        </div>

        <Accordion>
          <div className='div-flex-menu-option'>
            <AccordionSummary
              expandIcon={<MdOutlineExpandMore />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <MdOutlinePersonOutline />
              <Typography component="span">Doutores</Typography>
            </AccordionSummary>
          </div>
          <AccordionDetails>
            <h4 onClick={() => navigate("/visualizar-doutores")}>Visualizar doutores(a)</h4>
            <h4 onClick={() => navigate("/cadastro-doutor")}>Cadastro de doutor(a)</h4>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <div className='div-flex-menu-option'>
            <AccordionSummary
              expandIcon={<MdOutlineExpandMore />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <MdOutlinePersonOutline />
              <Typography component="span">Pacientes</Typography>
            </AccordionSummary>
          </div>
          <AccordionDetails>
            <h4 onClick={() => navigate("/visualizar-pacientes")}>Visualizar Pacientes</h4>
            <h4 onClick={() => navigate("/cadastro-paciente")}>Novo Paciente</h4>
          </AccordionDetails>
        </Accordion>

      </div>

      <div className="content">
        <div>
          <header>
            <div><h2>LOGO</h2></div>
            <div className="header-content">
              <span><IoIosNotificationsOutline /></span>
              <Button
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{
                  borderRadius: "50%",
                  padding: "20px",
                  backgroundColor: "#1e757a",
                  display: "flex",
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  fontSize: "16px",
                  fontWeight: "bold",
                  margin: "auto",
                  width: "20px",
                  height: "20px",
                  minWidth: "0"
                }}
              >
                
              </Button>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                sx={{
                  top: "50px"
                }}
              >
                <MenuItem onClick={handleClose}><span style={{ display: 'flex', gap: '20px' }}><FaRegUser /></span>{user}</MenuItem>
                <MenuItem onClick={handleClose}><span style={{ display: 'flex', gap: '20px' }}><SlSettings /></span>Configurações</MenuItem>
                <MenuItem onClick={handleClose}>
                  <span
                    onClick={handleLogout}
                    style={{ display: 'flex', gap: '20px' }}
                  >
                    <MdOutlineLogout />
                  </span>Sair
                </MenuItem>
              </Menu>
            </div>
          </header>
        </div>
        <Outlet />
      </div>
    </div >
  );
};

export default MainLayout;
