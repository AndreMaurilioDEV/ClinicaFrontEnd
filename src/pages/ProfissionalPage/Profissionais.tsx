import React, { useContext, useEffect, useState } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { fetchDelete } from '../../api/api';
import themeContext from '../../theme/themeContext';
import { useFilters } from '../../hooks/useFilter';
import { MdCancel } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoSearchOutline, IoCalendarOutline, IoFilterOutline } from "react-icons/io5";
import { TbStethoscope } from "react-icons/tb";
import { TextField } from '@mui/material';
import { formatarData } from '../../utils/Formats';
import { getInitials, getColorForString } from '../../utils/Avatar';
import EmptyState from '../../components/EmptyState';
import { useNavigate } from 'react-router-dom';
import './Profissionais.css';

const Doutores = () => {
  const { data: doutores, isLoading, isError } = useFetchData('medicos');
  const theme = useContext(themeContext);
  const fillHook = useFilters();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSearchTerm(theme.filters.filterByName);
  }, [theme.filters.filterByName]);


  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar os dados.</p>;

  const handleEdit = (id: number) => {
    alert(`Editar doutor com ID: ${id}`);
  };

  const baseVazia = !doutores || doutores.length === 0;

  const filteredDoutores = (!baseVazia && searchTerm)
    ? doutores.filter((doutor: any) =>
      doutor.nome && doutor.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : (doutores || []);

  const buscaSemResultado = !baseVazia && searchTerm && filteredDoutores.length === 0;

  const handleDelete = async (id: number) => {
    const nomeDoutor = doutores?.filter((doutor) => doutor.id == id).map((data) => data.nome);
    if (window.confirm(`Tem certeza de que deseja excluir o doutor(a): ${nomeDoutor}?`)) {
      try {
        await fetchDelete('medicos', id);
        alert(`Doutor(a): ${nomeDoutor} foi excluído com sucesso!`);
      } catch (error) {
        console.error('Erro ao excluir o doutor:', error);
        alert(`Erro ao tentar excluir o doutor com ID: ${id}. Tente novamente.`);
      }
    }
  };

  const handleLimparBusca = () => {
    fillHook.handleChange('');
  };

  return (
    <div className="doutores-content">
      <div className="doutores-header">
        <div>
          <h2>Doutores</h2>
          <p>{baseVazia ? '0' : filteredDoutores.length} profissional(is) cadastrado(s)</p>
        </div>
        <TextField
          placeholder="Pesquisar doutor"
          variant="outlined"
          name={fillHook.name.value}
          className="custom-textfield doutores-search"
          onChange={({ target }) => fillHook.handleChange(target.value)}
          disabled={baseVazia}
          InputProps={{
            startAdornment: <IoSearchOutline style={{ color: '#98a2b3', marginRight: 8 }} />
          }}
        />
      </div>

      {baseVazia ? (
        <EmptyState
          icon={<TbStethoscope />}
          iconBg="#e6f2f2"
          iconColor="#1e757a"
          title="Nenhum doutor cadastrado"
          description="Cadastre o primeiro profissional para liberar a agenda."
          actionLabel="Cadastrar doutor"
          onAction={() => navigate('/cadastro-doutor')}
        />
      ) : buscaSemResultado ? (
        <EmptyState
          icon={<IoFilterOutline />}
          iconBg="#f1efe8"
          iconColor="#444441"
          title="Nenhum resultado encontrado"
          description={`Não encontramos doutores para "${searchTerm}".`}
          actionLabel="Limpar busca"
          onAction={handleLimparBusca}
        />
      ) : (
        <div className="doutores-lista">
          {filteredDoutores.map((doutor: any) => {
            const color = getColorForString(doutor.especialidadeMedica);
            return (
              <div key={doutor.id} className="doutor-row">
                <div
                  className="doutor-avatar"
                  style={{ background: color.bg, color: color.text }}
                >
                  {getInitials(doutor.nome)}
                </div>
                <div className="doutor-info">
                  <div className="doutor-nome">{doutor.nome}</div>
                  <div className="doutor-crm">CRM {doutor.crm}</div>
                </div>
                <div className="doutor-especialidade">
                  <span style={{ background: color.bg, color: color.text }}>
                    {doutor.especialidadeMedica || 'Não informado'}
                  </span>
                </div>
                <div className="doutor-nascimento">
                  <IoCalendarOutline />
                  {doutor.date ? formatarData(doutor.date) : '—'}
                </div>
                <div className="doutor-acoes">
                  <button onClick={() => handleEdit(doutor.id)} className="doutor-icon-btn" aria-label="Editar doutor">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(doutor.id)} className="doutor-icon-btn doutor-icon-danger" aria-label="Excluir doutor">
                    <MdCancel />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

};

export default Doutores;