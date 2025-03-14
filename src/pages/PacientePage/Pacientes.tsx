import React, { useContext, useEffect, useState } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { fetchDelete } from '../../api/api';
import themeContext from '../../theme/themeContext';
import { useFilters } from '../../hooks/useFilter';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { IoIosInformationCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";

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
  if (!pacientes || pacientes.length === 0) return <p>Nenhum paciente encontrado.</p>;


  const handleNavigate = (id: number) => {
    navigate(`/visualizar-pacientes-detalhes/${id}`)
  };

  const filteredPacientes = searchTerm
    ? pacientes.filter((paciente: any) =>
      paciente.nome && paciente.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : pacientes;

  console.log('Pacientes:', pacientes);

  const handleDelete = async (id: number) => {
    const nomePaciente = pacientes.find((paciente) => paciente.id === id)?.nome || 'desconhecido';
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

  console.log(pacientes)

  return (
    <div>
      <div className='div-flex-row' style={{
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>Visualizar todos os Pacientes</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
        }}>
          <TextField
            id="outlined-basic" label="Pesquisar" variant="outlined"
            name={fillHook.name.value}
            className="custom-textfield"
            onChange={({ target }) => fillHook.handleChange(target.value)}
            sx={{
              backgroundColor: 'white'
            }}
          />
        </form>
      </div>
      {filteredPacientes ?
        <table>
          <thead>
            <tr>
              <th>NOME</th>
              <th>CPF</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filteredPacientes.map((paciente: any) => (
              <tr key={paciente.id} className='rounded-row'>
                <td>{paciente.nome}</td>
                <td>{paciente.cpf}</td>
                <td>
                  <div className='div-flex-row'>
                    <button onClick={() => handleNavigate(paciente.id)}><span><IoIosInformationCircle /></span></button>
                    <button onClick={() => handleDelete(paciente.id)}>
                      <span style={{
                        color: 'red'
                      }}><MdCancel /></span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table> : <p>Nenhum Doutor(a) Encontrado</p>}
    </div>
  );
};

export default Pacientes;