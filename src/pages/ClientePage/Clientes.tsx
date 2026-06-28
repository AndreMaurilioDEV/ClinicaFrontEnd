import React, { useContext, useEffect, useState } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { fetchDelete } from '../../api/api';
import themeContext from '../../theme/themeContext';
import { useFilters } from '../../hooks/useFilter';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { IoSearchOutline, IoChevronForward, IoFilterOutline } from "react-icons/io5";
import { TbUsers } from "react-icons/tb";
import { MdCancel } from "react-icons/md";
import { calcularIdade } from '../../utils/IdadeFunction';
import { getInitials, getColorForString } from '../../utils/Avatar';
import EmptyState from '../../components/EmptyState';
import './Clientes.css';

const Pacientes = () => {
  const { data: pacientes, isLoading, isError } = useFetchData('pacientes');
  const theme = useContext(themeContext);
  const filHook = useFilters();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    setSearchTerm(theme.filters.filterByName);
  }, [theme.filters.filterByName]);

  const fillHook = useFilters();

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar os dados.</p>;

  const handleNavigate = (id: number) => {
    navigate(`/visualizar-pacientes-detalhes/${id}`)
  };

  const baseVazia = !pacientes || pacientes.length === 0;

  const filteredPacientes = (!baseVazia && searchTerm)
    ? pacientes.filter((paciente: any) =>
      paciente.nome && paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : (pacientes || []);

  const buscaSemResultado = !baseVazia && searchTerm && filteredPacientes.length === 0;

  const handleDelete = async (id: number) => {
    const nomePaciente = pacientes?.find((paciente) => paciente.id === id)?.nome || 'desconhecido';
    if (window.confirm(`Tem certeza de que deseja excluir o Paciente: ${nomePaciente}?`)) {
      try {
        await fetchDelete('pacientes', id);
        alert(`Paciente: ${nomePaciente} foi excluído com sucesso!`);
      } catch (error) {
        console.error('Erro ao excluir o paciente:', error);
        alert(`Erro ao tentar excluir o paciente com ID: ${id}. Tente novamente.`);
      }
    }
  };

  const handleLimparBusca = () => {
    fillHook.handleChange('');
  };

  return (
    <div className="pacientes-content">
      <div className="pacientes-header">
        <div>
          <h2>Pacientes</h2>
          <p>{baseVazia ? '0' : filteredPacientes.length} paciente(s) cadastrado(s)</p>
        </div>
        <TextField
          placeholder="Pesquisar paciente"
          variant="outlined"
          name={fillHook.name.value}
          className="custom-textfield pacientes-search"
          onChange={({ target }) => fillHook.handleChange(target.value)}
          disabled={baseVazia}
          InputProps={{
            startAdornment: <IoSearchOutline style={{ color: '#98a2b3', marginRight: 8 }} />
          }}
        />
      </div>

      {baseVazia ? (
        <EmptyState
          icon={<TbUsers />}
          iconBg="#eeedfe"
          iconColor="#3c3489"
          title="Nenhum paciente cadastrado"
          description="Cadastre o primeiro paciente para começar a organizar atendimentos."
          actionLabel="Cadastrar paciente"
          onAction={() => navigate('/cadastro-paciente')}
        />
      ) : buscaSemResultado ? (
        <EmptyState
          icon={<IoFilterOutline />}
          iconBg="#f1efe8"
          iconColor="#444441"
          title="Nenhum resultado encontrado"
          description={`Não encontramos pacientes para "${searchTerm}".`}
          actionLabel="Limpar busca"
          onAction={handleLimparBusca}
        />
      ) : (
        <div className="pacientes-lista">
          {filteredPacientes.map((paciente: any) => {
            const temPlano = !!paciente.planoDeSaude;
            const color = temPlano ? getColorForString(paciente.planoDeSaude) : { bg: '#f1efe8', text: '#444441' };
            return (
              <div
                key={paciente.id}
                className="paciente-row"
                onClick={() => handleNavigate(paciente.id)}
              >
                <div
                  className="paciente-avatar"
                  style={{ background: getColorForString(paciente.nome).bg, color: getColorForString(paciente.nome).text }}
                >
                  {getInitials(paciente.nome)}
                </div>
                <div className="paciente-info">
                  <div className="paciente-nome">{paciente.nome}</div>
                  <div className="paciente-cpf">CPF {paciente.cpf}</div>
                </div>
                <div className="paciente-idade">
                  {paciente.date ? `${calcularIdade(paciente.date)} anos` : '—'}
                </div>
                <div className="paciente-plano">
                  <span style={{ background: color.bg, color: color.text }}>
                    {temPlano ? paciente.planoDeSaude : 'Sem plano'}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(paciente.id); }}
                  className="paciente-icon-btn paciente-icon-danger"
                  aria-label="Excluir paciente"
                >
                  <MdCancel />
                </button>
                <IoChevronForward className="paciente-chevron" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Pacientes;