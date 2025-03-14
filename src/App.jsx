import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/LoginPage/Login'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import ThemeProvider from './themeProvider/theme'
import CadastroDoutor from './pages/ProfissionalPage/DoutorCadastro';
import PacienteCadastro from './pages/PacientePage/PacienteCadastro';
import Consultas from './pages/ConsultaPages/Consultas'
import MainLayout from './Outlet/mainLayout'
import Doutores from './pages/ProfissionalPage/Doutores'
import Pacientes from './pages/PacientePage/Pacientes'
import CadastroConsulta from './pages/ConsultaPages/ConsultaCadastro'
import PacienteDetalhes from './pages/PacientePage/PacienteDetalhes'
import AlterarSenha from './pages/LoginPage/AlterarSenha'
import RedifinicaoRequest from './pages/SenhaPages/RedifinicaoRequest'
import ConfirmarRedefinicao from './pages/SenhaPages/ConfirmarRedifinicao'
import AuthProvider from './hooks/AuthProvider'
import { SnackbarProvider } from 'notistack';


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top', 
            horizontal: 'right', 
          }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/esqueci-senha" element={<RedifinicaoRequest />} />
            <Route path="/verificacao" element={<ConfirmarRedefinicao />} />
            <Route path="/redefinir-senha" element={<AlterarSenha />} />

            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/consultas" element={<Consultas />} />
              <Route path="/cadastro-paciente" element={<PacienteCadastro />} />
              <Route path="/visualizar-doutores" element={<Doutores />} />
              <Route path="/visualizar-pacientes" element={<Pacientes />} />
              <Route path="/cadastro-doutor" element={<CadastroDoutor />} />
              <Route path="/cadastro-consulta" element={<CadastroConsulta />} />
              <Route path="/visualizar-pacientes-detalhes/:id" element={<PacienteDetalhes />} />
            </Route>
          </Routes>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
};

export default App
