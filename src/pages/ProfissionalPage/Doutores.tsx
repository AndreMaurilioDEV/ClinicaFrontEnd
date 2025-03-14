import React, { useContext, useEffect, useState } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { fetchDelete } from '../../api/api';
import themeContext from '../../theme/themeContext';
import { useFilters } from '../../hooks/useFilter';
import { MdCancel } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { TextField } from '@mui/material';
import { formatDate } from 'react-datepicker/dist/date_utils';
import { formatarData } from '../../utils/Formats';


const Doutores = () => {
  const { data: doutores, isLoading, isError } = useFetchData('medicos');
  const theme = useContext(themeContext);
  const fillHook = useFilters();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSearchTerm(theme.filters.filterByName);
  }, [theme.filters.filterByName]);


  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar os dados.</p>;
  if (!doutores || doutores.length === 0) return <p>Nenhum doutor encontrado.</p>;

  const handleEdit = (id: number) => {
    alert(`Editar doutor com ID: ${id}`);
  };

  const filteredDoutores = searchTerm
    ? doutores.filter((doutor: any) =>
      doutor.nome && doutor.nome.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : doutores;

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

  return (
    <div>
      <div className='div-flex-row' style={{
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2>Visualizar todos os doutores(a)</h2>
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
      {filteredDoutores ?
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>CRM</th>
              <th>Especialidade</th>
              <th>Data de Nascimento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoutores?.map((doutor: any) => (
              <tr key={doutor.id} className='rounded-row'>
                <td>{doutor.id}</td>
                <td>{doutor.nome}</td>
                <td>{doutor.crm}</td>
                <td>{doutor.especialidadeMedica}</td>
                <td>{doutor.date}</td>
                <td>
                  <button onClick={() => handleDelete(doutor.id)} className='icons-acoes' style={{ color: 'red' }}><MdCancel /></button>
                  <button onClick={() => handleEdit(doutor.id)} className='icons-acoes' style={{ color: 'blue' }}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table> : <p>Nenhum Doutor(a) Encontrado</p>}
    </div>
  );

};

export default Doutores;