import { useEffect, useContext, useState,  } from "react";
import React from "react";
import { useFetchData } from "../../hooks/useFetchData";
import themeContext from "../../theme/themeContext";
import { useFilters } from "../../hooks/useFilter";
import { fetchDelete } from "../../api/api";
import { IoMdAdd } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import type { ConsultaData, PatientData } from "../../interface/Interfaces";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { LuFilterX } from "react-icons/lu";
import { fetchStatus } from "../../api/api";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import AlertDialog from "../../components/alertDialog";
import { useAuth } from "../../hooks/AuthProvider"
import { API_URL } from "../../api/api";
import { useSnackbar } from "notistack";

const Consultas = () => {
  const { data: consultas } = useFetchData<ConsultaData>('consultas');
  const { data: pacientes } = useFetchData<PatientData>('pacientes');
  const [filteredData, setFilteredData] = useState<ConsultaData[]>([]);
  const theme = useContext(themeContext);
  const fillHook = useFilters();
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState({
    atendimento: '',
    status: '',
    paciente: '',
  });
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [isLoading, setIsLoading] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState<{ [key: number]: string }>({});
  const [showAlert, setShowAlert] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const { api } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (Object.keys(statusUpdates).length > 0) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  }, [statusUpdates]);

  useEffect(() => {
    setSearchTerm(theme.filters.filterByName);
  }, [theme.filters.filterByName]);

  const handleFilter = () => {
    if (!consultas || consultas.length === 0) return;
    const filtered = consultas.filter((item) => {
      const matchPacienteNome = searchTerm ?
        item.pacienteCpf.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchStatus = search.status ? item.status === search.status : true;
      const matchAtendimento = search.atendimento ? item.tipoAtendimento === search.atendimento : true;
      const matchDate = selectedDate ? item.dateTime === selectedDate : true;
      return matchPacienteNome && matchStatus && matchAtendimento && matchDate;
    });
    setFilteredData(filtered);
    setIsLoading(false);
  };

  useEffect(() => {
    handleFilter();
  }, [consultas, searchTerm, search.status, search.atendimento, search.paciente, selectedDate]);

  const navigate = useNavigate();

  const handleStatus = (id: number, value: string) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [id]: value
    }));
    const consultaId = consultas ? consultas.find((item) => item.id === id) : null;
    const payload = {
      status: value
    };
    if (consultaId) {
      setTimeout(async () => await api.put(`/consultas/status-consulta/${id}`, payload), 0);
      enqueueSnackbar("Status do atendimento atualizado com sucesso!!", { variant: "success" });
    } else {
      enqueueSnackbar("Erro ao atualizar o status da consulta!!", { variant: "error" });
    }
  }

  const handleClickOpenDialog = (id: number) => {
    setDeleteItemId(id);
    setOpenDialog(true);
  };


  const handleSearchChange = (field: string, value: string) => {
    setSearch(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleDeleteConfirm = async (id: number) => {
    try {
      setOpenDialog(false);
      setDeleteItemId(id);
      const response = await api.delete(`/consultas/${id}`);
      enqueueSnackbar("Atendimento deletado com sucesso!!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Erro ao deletar atendimento!!", { variant: "error" });
    }
  };


  const handleDelete = (id: number) => {
    handleClickOpenDialog(id);
  };


  const handleClear = () => {
    setSearch({
      atendimento: '',
      status: '',
      paciente: ''
    });
  }

  return (
    <>
      <div className="div-agenda-content">
        <div className="div-agenda-details">
          <div>
            <button onClick={() => navigate('/cadastro-consulta')}
              className="button-agendamento"
            >
              <IoMdAdd />Novo Agendamento
            </button>
          </div>
          <div>
            <form onSubmit={(e) => {
              e.preventDefault();
            }}>
              <input
                type="date"
                value={selectedDate}
                onChange={({ target }) => setSelectedDate(target.value)}
              />
            </form>
          </div>
        </div>
        <div className="div-filters">
          <div>
            <p>Filtrar por</p>
          </div>

          <FormControl fullWidth className="form-control-consultas">

            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={search.status}
              onChange={({ target }) => handleSearchChange('status', target.value)}
              label="Status"
            >
              <MenuItem value="AGENDADO">Agendado</MenuItem>
              <MenuItem value="ATENDIDO">Atendido</MenuItem>
              <MenuItem value="FALTOU">Faltou</MenuItem>
            </Select>
          </FormControl>


          <FormControl fullWidth className="form-control-consultas">
            <InputLabel id="demo-simple-select-label">Atendimento</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={search.atendimento}
              onChange={({ target }) => handleSearchChange('atendimento', target.value)}
              label="Atendimento"
            >
              <MenuItem value="CONSULTA">Consulta</MenuItem>
              <MenuItem value="EXAME">Exame</MenuItem>
              <MenuItem value="PROCEDIMENTO">Procedimento</MenuItem>
              <MenuItem value="RETORNO">Retorno</MenuItem>
              <MenuItem value="ENCAIXE">Encaixe</MenuItem>
            </Select>
          </FormControl>


          <FormControl fullWidth className="form-control-consultas" sx={{
            flexDirection: "row"
          }}>

            <InputLabel id="demo-simple-select-label">Pacientes</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={search.paciente}
              onChange={({ target }) => handleSearchChange('paciente', target.value)}
              label="Pacientes"
            >
              {pacientes?.map((paciente) => (
                <MenuItem value={paciente.nome}>{paciente.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            id="outlined-basic" label="Pesquisar" variant="outlined"
            name={fillHook.name.value}
            className="custom-textfield"
            onChange={({ target }) => fillHook.handleChange(target.value)}
          />

          {(search.atendimento || search.paciente || search.status) &&
            <button onClick={handleClear}><LuFilterX /></button>
          }

        </div>
        {filteredData && filteredData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>HORÁRIO</th>
                <th>ATENDIMENTO</th>
                <th>PROFISSIONAL</th>
                <th>PACIENTE</th>
                <th>STATUS</th>
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((item) => (
                <tr key={item.id} className="rounded-row">
                  <td>{item.horario}</td>
                  <td>{item.tipoAtendimento}</td>
                  <td>{item.medicoNome}</td>
                  <td>{item.pacienteCpf}</td>
                  <td>
                    <FormControl fullWidth className="form-control-consultas">
                      <Select
                        value={statusUpdates[item.id] || item.status}
                        onChange={({ target }) => {
                          handleStatus(item.id, target.value)
                        }}
                      >
                        <MenuItem value="AGENDADO">Agendado</MenuItem>
                        <MenuItem value="ATENDIDO">Atendido</MenuItem>
                        <MenuItem value="FALTOU">Faltou</MenuItem>
                      </Select>
                    </FormControl>
                  </td>
                  <td>
                    <div className="div-flex-options-consulta">
                      <button onClick={() => handleDelete(item.id)} className="icons-acoes">
                        <MdCancel />
                      </button>
                      <button className="icons-acoes"><FaEdit /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhuma Consulta Encontrada</p>
        )}


      </div>
      {showAlert && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
          Modificação feita com sucesso!
        </Alert>
      )}

      <AlertDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleDeleteConfirm}
        itemId={deleteItemId!}
      />

    </>
  )
};

export default Consultas;