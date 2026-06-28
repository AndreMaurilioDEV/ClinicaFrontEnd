import { useState } from "react";
import React from 'react';
import { useFetchData } from "../../hooks/useFetchData";
import './ConsultaCadastro.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from "../../hooks/AuthProvider";
import { useSnackbar } from "notistack";
import { AxiosError } from "axios";
import { IoCalendarOutline, IoTimeOutline, IoPeopleOutline, IoClipboardOutline } from "react-icons/io5";

interface CadastroConsultaProps {
  showForm: boolean;
  handleToggleForm: () => void;
}

interface FormCadastroConsulta {
  horario: string;
  date: Date | null;
  medicoId: number;
  pacienteId: number;
  status: string;
  tipoAtendimento: string
}

function CadastroConsulta() {

  const { data: doutores } = useFetchData('medicos');
  const { data: pacientes } = useFetchData('pacientes');
  const [formCadastro, setFormCadastro] = useState<FormCadastroConsulta>({
    horario: '',
    date: null,
    medicoId: 0,
    pacienteId: 0,
    status: 'AGENDADO',
    tipoAtendimento: ''
  });

  const handleChange = (
    { target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name: targetName, value } = target;
    setFormCadastro({ ...formCadastro, [targetName]: value })
  };

  const handleClear = () => {
    setFormCadastro({
      horario: '',
      date: null,
      medicoId: 0,
      pacienteId: 0,
      status: 'AGENDADO',
      tipoAtendimento: ''
    })
  }

  const handleDateChange = (date: Date | null) => {
    setFormCadastro({ ...formCadastro, date });
  };

  function formatTimeForLocalTime(time: string) {
    if (time.split(':').length === 3) {
      return time;
    }
    return `${time}:00`;
  }

  const { api } = useAuth();
  const {enqueueSnackbar} = useSnackbar();

  const handleSubmit = async () => {
    const dateFormatted = formCadastro.date ? new Date(formCadastro.date)
      .toISOString().split('T')[0] : '';
    const horarioLocalTime = formatTimeForLocalTime(formCadastro.horario)
    const payload = {
      horario: horarioLocalTime,
      date: dateFormatted,
      medicoIds: formCadastro.medicoId,
      pacienteIds: formCadastro.pacienteId,
      status: formCadastro.status,
      tipoAtendimento: formCadastro.tipoAtendimento
    };
    try {
      const response = await api.post("/consultas", payload);
      enqueueSnackbar("Atendimento criado com sucesso!!", { variant: "success" });
      handleClear();
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError.response?.data.message;
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <>
    <section className="cadastro-consulta">
      <div className="consulta-card">

        <div className="consulta-card-header">
          <div className="consulta-icon-disc">
            <IoCalendarOutline />
          </div>
          <div>
            <h2>Novo Agendamento</h2>
            <p>Preencha os dados para agendar um atendimento</p>
          </div>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>

          <div className="consulta-section">
            <div className="consulta-section-label">
              <IoTimeOutline /><span>Quando</span>
            </div>
            <div className="consulta-grid">
              <div className="form-group">
                <label htmlFor="data">Data</label>
                <DatePicker
                  selected={formCadastro.date}
                  onChange={handleDateChange}
                  name="date"
                  className="input-data"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecione a data"
                />
              </div>
              <div className="form-group">
                <label htmlFor="horario">Horário</label>
                <input
                  type="time"
                  id="horario"
                  name="horario"
                  value={formCadastro.horario}
                  onChange={handleChange}
                  className="input-horario"
                />
              </div>
            </div>
          </div>

          <div className="consulta-section">
            <div className="consulta-section-label">
              <IoPeopleOutline /><span>Quem</span>
            </div>
            <div className="consulta-grid">
              <div className="form-group">
                <label htmlFor="medicoId">Profissional</label>
                <select
                  id="medicoId"
                  name="medicoId"
                  value={formCadastro.medicoId}
                  onChange={(e) => setFormCadastro({ ...formCadastro, medicoId: Number(e.target.value) })}
                  className="select-medico"
                >
                  <option value="">Selecione o Médico</option>
                  {doutores?.map((doutor) => (
                    <option value={doutor.id} key={doutor.id}>{doutor.nome}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="pacienteId">Paciente</label>
                <select
                  id="pacienteId"
                  name="pacienteId"
                  value={formCadastro.pacienteId}
                  onChange={(e) => setFormCadastro({ ...formCadastro, pacienteId: Number(e.target.value) })}
                  className="select-paciente"
                >
                  <option value="">Selecione o Paciente</option>
                  {pacientes?.map((paciente) => (
                    <option value={paciente.id} key={paciente.id}>{paciente.nome}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="consulta-section">
            <div className="consulta-section-label">
              <IoClipboardOutline /><span>Atendimento</span>
            </div>
            <div className="consulta-grid">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formCadastro.status}
                  onChange={(e) => setFormCadastro({ ...formCadastro, status: e.target.value })}
                  className="select-status"
                >
                  <option value="AGENDADO">Agendado</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="tipoAtendimento">Tipo</label>
                <select
                  id="tipoAtendimento"
                  name="tipoAtendimento"
                  value={formCadastro.tipoAtendimento}
                  onChange={(e) => setFormCadastro({ ...formCadastro, tipoAtendimento: e.target.value })}
                  className="select-tipo"
                >
                  <option value="">Selecione o Atendimento</option>
                  <option value="CONSULTA">Consulta</option>
                  <option value="EXAME">Exame</option>
                  <option value="PROCEDIMENTO">Procedimento</option>
                  <option value="ENCAIXE">Encaixe</option>
                  <option value="RETORNO">Retorno</option>
                </select>
              </div>
            </div>
          </div>

          <div className="consulta-footer">
            <button type="button" className="btn-limpar" onClick={handleClear}>
              Limpar
            </button>
            <button type="submit" className="btn-cadastrar">
              Cadastrar
            </button>
          </div>

        </form>
      </div>
    </section>
    </>
  )
};

export default CadastroConsulta;