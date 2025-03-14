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
      <section className="cadastro-sec">
        <h2>Cadastrar Doutores</h2>
        <div className="div-cadastro-flex">

          <div className="div-cadastro">
          <p>* campos obrigatórios</p>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}>

              <div className="div-cadastro-flex">

                <div className="div-flex-row" style={{
                  flexDirection: 'column',
                  alignItems: 'normal',
                  gap: '30px'
                }}>


                  <TextField
                    id="outlined-basic" label="Nome Completo" variant="outlined" fullWidth
                    name="nome"
                    className="custom-textfield"
                    onChange={handleChange}
                    value={formDoutor.nome}
                    required
                  />


                  <div style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <label htmlFor="">Data Nascimento:</label>
                      <DateField
                        value={formDoutor.date}
                        onChange={(newValue) => {
                          setFormDoutor(prevState => ({
                            ...prevState,
                            date: newValue || null
                          }));
                        }}
                        format="DD/MM/YYYY"
                        required
                      />
                    </LocalizationProvider>
                  </div>

                  <TextField
                    id="outlined-basic" label="CRM" variant="outlined" fullWidth
                    name="crm"
                    className="custom-textfield"
                    onChange={handleChange}
                    value={formDoutor.crm}
                    required
                  />

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>

                    <FormControl fullWidth className="form-control-consultas">
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

              </div>

              <div className="div-form-cadastro-buttons">
                <button className="button-geral-class">Cadastrar</button>
                <button type="submit" onClick={() => {
                  navigate("/dashboard")
                }}
                  className="button-geral-class"
                >
                  Voltar
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
};

export default CadastroDoutor;