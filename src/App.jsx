import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/LoginPage/Login'
import DashboardPage from './pages/DashboardPage/DashboardPage'
import ThemeProvider from './themeProvider/theme'
import CadastroDoutor from './pages/ProfissionalPage/ProfissionalCadastro';
import ClienteCadastro from './pages/ClientePage/ClienteCadastro';
import Consultas from './pages/ConsultaPages/Consultas'
import MainLayout from './Outlet/mainLayout'
import Doutores from './pages/ProfissionalPage/Profissionais'
import Clientes from './pages/ClientePage/Clientes'
import CadastroConsulta from './pages/ConsultaPages/ConsultaCadastro'
import ClienteDetalhes from './pages/ClientePage/ClienteDetalhes'
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
            <Route path="/redefinir-senha-obrigatoria" element={<AlterarSenha obrigatorio />} />

            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/consultas" element={<Consultas />} />
              <Route path="/cadastro-paciente" element={<ClienteCadastro />} />
              <Route path="/visualizar-doutores" element={<Doutores />} />
              <Route path="/visualizar-pacientes" element={<Clientes />} />
              <Route path="/cadastro-doutor" element={<CadastroDoutor />} />
              <Route path="/cadastro-consulta" element={<CadastroConsulta />} />
              <Route path="/visualizar-pacientes-detalhes/:id" element={<ClienteDetalhes />} />
            </Route>
          </Routes>
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
};

export default App