import { useState } from "react";
import { fetchPost } from "../../api/api";
import React from 'react';
import { useNavigate } from "react-router-dom";
import 'react-datepicker/dist/react-datepicker.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Dayjs } from "dayjs";
import { TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IoPersonOutline, IoCalendarOutline, IoDocumentTextOutline, IoBriefcaseOutline } from "react-icons/io5";

interface FormDoutor {
  nome: string;
  crm: string;
  especialidadeMedica: string;
  date: Dayjs | null;
}

function CadastroDoutor() {

  const navigate = useNavigate();
  const [formDoutor, setFormDoutor] = useState<FormDoutor>({
    nome: '',
    crm: '',
    especialidadeMedica: '',
    date: null
  });

  const formatDate = (dateValue: Dayjs | null): string => {
    if (dateValue) {
      return dateValue.format('YYYY-MM-DD');
    }
    return '';
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name: targetName, value } = event.target;
    setFormDoutor(prevState => ({
      ...prevState,
      [targetName]: targetName === 'date' ? new Date(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const json = {
      nome: formDoutor.nome,
      crm: formDoutor.crm,
      especialidadeMedica: formDoutor.especialidadeMedica,
      date: formatDate(formDoutor.date)
    };
    fetchPost(json, '/medicos')
  };

  return (
     <div>
      <section className="cadastro-sec" style={{ display: "flex", justifyContent: "center", padding: "30px 16px" }}>
        <div className="cadastro-card">

          <div className="cadastro-card-header">
            <div className="cadastro-icon-disc">
              <IoPersonOutline />
            </div>
            <div>
              <h2>Cadastrar profissional</h2>
              <p>* campos obrigatórios</p>
            </div>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>

            <div className="cadastro-section">
              <div className="cadastro-section-label">
                <IoCalendarOutline /><span>Dados pessoais</span>
              </div>
              <div className="cadastro-section-grid">
                <TextField
                  id="outlined-basic" label="Nome Completo" variant="outlined" fullWidth
                  name="nome"
                  className="custom-textfield"
                  onChange={handleChange}
                  value={formDoutor.nome}
                  required
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateField
                    label="Data Nascimento"
                    value={formDoutor.date}
                    onChange={(newValue) => {
                      setFormDoutor(prevState => ({
                        ...prevState,
                        date: newValue || null
                      }));
                    }}
                    format="DD/MM/YYYY"
                    required
                    fullWidth
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div className="cadastro-section">
              <div className="cadastro-section-label">
                <IoBriefcaseOutline /><span>Dados profissionais</span>
              </div>
              <div className="cadastro-section-grid">
                <TextField
                  id="outlined-basic" label="CRM" variant="outlined" fullWidth
                  name="crm"
                  className="custom-textfield"
                  onChange={handleChange}
                  value={formDoutor.crm}
                  required
                />

                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Especialidade</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formDoutor.especialidadeMedica}
                    onChange={handleChange}
                    label="Especialidade"
                    name="especialidadeMedica"
                    required
                  >
                    <MenuItem value="CARDIOLOGIA">Cardiologia</MenuItem>
                    <MenuItem value="ORTOPEDIA">Ortopedia</MenuItem>
                    <MenuItem value="GINECOLOGIA">Ginecologia</MenuItem>
                    <MenuItem value="FONOAUDIOLOGIA">Fonoaudiologia</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="cadastro-footer">
              <button type="submit" className="btn-secondary" onClick={() => navigate("/dashboard")}>
                Voltar
              </button>
              <button type="submit" className="btn-primary">
                Cadastrar
              </button>
            </div>

          </form>
        </div>
      </section>
    </div>
  )
};

export default CadastroDoutor;