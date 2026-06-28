import { useEffect, useContext, useState } from "react";
import React from "react";
import { useFetchData } from "../../hooks/useFetchData";
import themeContext from "../../theme/themeContext";
import { useFilters } from "../../hooks/useFilter";
import { fetchDelete } from "../../api/api";
import { IoMdAdd } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoChevronBack, IoChevronForward, IoCalendarOutline } from "react-icons/io5";
import { LuFilterX } from "react-icons/lu";
import type { ConsultaData, PatientData } from "../../interface/Interfaces";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { fetchStatus } from "../../api/api";
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import AlertDialog from "../../components/alertDialog";
import { useAuth } from "../../hooks/AuthProvider";
import { API_URL } from "../../api/api";
import { useSnackbar } from "notistack";
import "./Consultas.css";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  AGENDADO: { bg: "#e6f1fb", color: "#0c447c" },
  ATENDIDO: { bg: "#eaf3de", color: "#27500a" },
  FALTOU: { bg: "#fcebeb", color: "#791f1f" },
};

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
  };

  useEffect(() => {
    handleFilter();
  }, [consultas, searchTerm, search.status, search.atendimento, search.paciente, selectedDate]);

  const navigate = useNavigate();

  // Navegação de data sem libs externas: soma/subtrai 1 dia em string "YYYY-MM-DD"
  const shiftDate = (days: number) => {
    const [ano, mes, dia] = selectedDate.split("-").map(Number);
    const date = new Date(ano, mes - 1, dia);
    date.setDate(date.getDate() + days);
    const novaData = date.toISOString().split("T")[0];
    setSelectedDate(novaData);
  };

  const formatDateLabel = (isoDate: string) => {
    const [ano, mes, dia] = isoDate.split("-").map(Number);
    const date = new Date(ano, mes - 1, dia);
    const label = date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

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
      await api.delete(`/consultas/${id}`);
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
      <div className="agenda-content">

        <div className="agenda-header">
          <div>
            <h2>Agenda do dia</h2>
            <p>{filteredData.length} atendimento(s) encontrado(s)</p>
          </div>
          <button onClick={() => navigate('/cadastro-consulta')} className="btn-primary agenda-btn-novo">
            <IoMdAdd /> Novo agendamento
          </button>
        </div>

        <div className="agenda-date-nav">
          <button onClick={() => shiftDate(-1)} aria-label="Dia anterior">
            <IoChevronBack />
          </button>
          <span>
            <IoCalendarOutline />
            {formatDateLabel(selectedDate)}
          </span>
          <button onClick={() => shiftDate(1)} aria-label="Próximo dia">
            <IoChevronForward />
          </button>
        </div>

        <div className="agenda-filtros">
          <div className="agenda-filtros-label">Filtrar por</div>
          <div className="agenda-filtros-grid">
            <FormControl fullWidth className="form-control-consultas">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
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
              <InputLabel id="atendimento-label">Atendimento</InputLabel>
              <Select
                labelId="atendimento-label"
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

            <FormControl fullWidth className="form-control-consultas">
              <InputLabel id="paciente-label">Pacientes</InputLabel>
              <Select
                labelId="paciente-label"
                value={search.paciente}
                onChange={({ target }) => handleSearchChange('paciente', target.value)}
                label="Pacientes"
              >
                {pacientes?.map((paciente) => (
                  <MenuItem value={paciente.nome} key={paciente.id}>{paciente.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Pesquisar" variant="outlined"
              name={fillHook.name.value}
              className="custom-textfield"
              onChange={({ target }) => fillHook.handleChange(target.value)}
              fullWidth
            />

            {(search.atendimento || search.paciente || search.status) &&
              <button onClick={handleClear} className="agenda-btn-limpar-filtro" aria-label="Limpar filtros">
                <LuFilterX />
              </button>
            }
          </div>
        </div>

        {filteredData && filteredData.length > 0 ? (
          <div className="agenda-lista">
            <div className="agenda-row agenda-row-header">
              <div>Horário</div>
              <div>Atendimento</div>
              <div>Profissional</div>
              <div>Paciente</div>
              <div>Status</div>
              <div className="agenda-col-acoes">Ações</div>
            </div>

            {filteredData?.map((item) => {
              const statusAtual = statusUpdates[item.id] || item.status;
              const statusStyle = STATUS_STYLES[statusAtual] ?? STATUS_STYLES.AGENDADO;
              return (
                <div key={item.id} className="agenda-row">
                  <div className="agenda-horario">{item.horario}</div>
                  <div>{item.tipoAtendimento}</div>
                  <div>{item.medicoNome}</div>
                  <div>{item.pacienteCpf}</div>
                  <div>
                    <FormControl fullWidth className="agenda-status-select">
                      <Select
                        value={statusAtual}
                        onChange={({ target }) => handleStatus(item.id, target.value)}
                        sx={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          borderRadius: '20px',
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                          '& .MuiSelect-select': { padding: '6px 14px' },
                        }}
                      >
                        <MenuItem value="AGENDADO">Agendado</MenuItem>
                        <MenuItem value="ATENDIDO">Atendido</MenuItem>
                        <MenuItem value="FALTOU">Faltou</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="agenda-col-acoes">
                    <button className="agenda-icon-btn" aria-label="Editar atendimento">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="agenda-icon-btn agenda-icon-danger" aria-label="Cancelar atendimento">
                      <MdCancel />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="agenda-vazio">
            <IoCalendarOutline />
            <p>Nenhuma consulta encontrada para esse dia ou filtro.</p>
          </div>
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