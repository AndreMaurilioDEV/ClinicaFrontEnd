import { useState } from "react";
import { fetchPost, API_URL } from "../../api/api";
import React from 'react';
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { handleCepChange } from "../../utils/ViaCEP";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { TextField } from "@mui/material";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import './PacienteCadastro.css'

interface FormPaciente {
  nome: string,
  cpf: string,
  telefone: string,
  date: Dayjs | null,
  endereco: string,
  estado: string,
  cidade: string,
  cep: string,
  email: string,
  planoDeSaude: string,
  numeroPlano: string,
  ativo: boolean,
  genero: string
};

function PacienteCadastro() {

  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [erro, setErro] = useState(false);


  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    if (!isChecked) {
      setFormPaciente({
        ...formPaciente,
        planoDeSaude: '',
        numeroPlano: ''
      });
    }
  };

  const [formPaciente, setFormPaciente] = useState<FormPaciente>({
    nome: '',
    cpf: '',
    telefone: '',
    date: null,
    endereco: '',
    estado: '',
    cidade: '',
    cep: '',
    email: '',
    planoDeSaude: '',
    numeroPlano: '',
    ativo: true,
    genero: ''
  });


  const formatDate = (dateValue: Dayjs | null): string => {
    if (dateValue) {
      return dateValue.format('YYYY-MM-DD');
    }
    return '';
  };


  const handleChange = (
    { target }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name: targetName, value } = target;
    setFormPaciente(prevState => ({
      ...prevState,
      [targetName]: targetName === 'date' ? new Date(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPaciente.date) {
      setErro(true);
      return
    }
    setErro(false)
    const json = {
      nome: formPaciente.nome,
      cpf: formPaciente.cpf,
      telefone: formPaciente.telefone,
      date: formatDate(formPaciente.date),
      estado: formPaciente.estado,
      cidade: formPaciente.cidade,
      cep: formPaciente.cep,
      endereco: formPaciente.endereco,
      email: formPaciente.email,
      planoDeSaude: formPaciente.planoDeSaude,
      numeroPlano: formPaciente.numeroPlano,
      ativo: formPaciente.ativo,
      genero: formPaciente.genero
    }
    try {
      fetchPost(json, '/pacientes');
      setFormPaciente({
        nome: '',
        cpf: '',
        telefone: '',
        date: null,
        endereco: '',
        estado: '',
        cidade: '',
        cep: '',
        email: '',
        planoDeSaude: '',
        numeroPlano: '',
        ativo: true,
        genero: ''
      });
    } catch (error) {
      
    }
  };


  return (
    <div>
      <section className="cadastro-sec">
        <h2>Cadastrar Pacientes</h2>
        <div className="div-cadastro-flex">

          <div className="div-cadastro">
            <form onSubmit={handleSubmit}>

              <div className="div-cadastro-flex">

          
                  <div className="div-cadastro-1">

                  <TextField
                    id="outlined-basic" label="Nome Completo" variant="outlined" fullWidth
                    name="nome"
                    className="custom-textfield"
                    onChange={handleChange}
                    value={formPaciente.nome}
                    required
                  />


                  <InputMask
                    mask="999.999.999-99"
                    value={formPaciente.cpf}
                    onChange={handleChange}
                  >
                    {() => (
                      <TextField
                        label="CPF"
                        variant="outlined"
                        className="custom-textfield"
                        fullWidth
                        name="cpf"
                        size="small"
                        required
                      />
                    )}
                  </InputMask>


                  <TextField
                    id="outlined-basic" label="Email" variant="outlined" fullWidth
                    name="email"
                    className="custom-textfield"
                    onChange={handleChange}
                    value={formPaciente.email}
                    required
                  />
              


      
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div>

                      <label htmlFor="">Data Nascimento*:</label>
                      <DateField
                        value={formPaciente.date}
                        onChange={(newValue) => {
                          setFormPaciente(prevState => ({
                            ...prevState,
                            date: newValue || null
                          }));
                        }}
                        required
                        format="DD/MM/YYYY"
                        helperText={erro ? "A data de nascimento é obrigatória!" : ""}
                        sx={{
                          '& .MuiInputBase-input': {
                            padding: 0,
                          },
                        }}
                        
                      />
                    </div>
                  </LocalizationProvider>

                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      color: '#555',
                      fontFamily: 'Poppins'
                    }}>Gênero*:</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="genero"
                      value={formPaciente.genero}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="FEMININO" control={<Radio />} label="Feminino" />
                      <FormControlLabel value="MASCULINO" control={<Radio />} label="Masculino" />
                      <FormControlLabel value="OUTRO" control={<Radio />} label="Outro" />
                    </RadioGroup>
                  </FormControl>
               



                  <InputMask
                    mask="(99) 99999-9999"
                    value={formPaciente.telefone}
                    onChange={handleChange}
                  >
                    {() => (
                      <TextField
                        label="DDD e número de celular"
                        variant="outlined"
                        className="custom-textfield"
                        fullWidth
                        required
                        name="telefone"
                        size="small"
                      />
                    )}
                  </InputMask>
                  </div>
                  
                  <div className="div-cadastro-1">

                  <InputMask
                    mask="99999-999"
                    value={formPaciente.cep}
                    onChange={(e) => handleCepChange(e.target.value, formPaciente, setFormPaciente)}
                  >
                    {() => (
                      <TextField
                        label="CEP"
                        variant="outlined"
                        className="custom-textfield"
                        fullWidth
                        name="cep"
                        size="small"
                        required
                      />
                    )}
                  </InputMask>


                  <TextField
                    id="outlined-basic" label="Estado" variant="outlined" fullWidth
                    name="estado"
                    className="custom-textfield"
                    onChange={handleChange}
                    value={formPaciente.estado}
                    disabled
                  />


                  <TextField
                    id="outlined-basic" label="Cidade" variant="outlined" fullWidth
                    name="cidade"
                    className="custom-textfield"
                    onChange={handleChange}
                    value={formPaciente.cidade}
                    disabled
                  />


                  <TextField
                    id="outlined-basic" label="Endereço" variant="outlined" fullWidth
                    name="endereco"
                    className="custom-textfield"
                    onChange={handleChange}
                    value={formPaciente.endereco}
                    disabled
                  />


                  <div style={{
                    display:'flex',
                    gap:'10px'
                  }}>
                  Plano de Saúde:
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  </div>


                {isChecked &&
                  <div className="cadastro-planos-infos">
                    <label >

                      Nome Plano de Saúde:
                      <input
                        className="inp-checked"
                        type="text"
                        name="planoDeSaude"
                        value={formPaciente.planoDeSaude}
                        onChange={handleChange}
                      />
                    </label>


                    <label >
                      Número do Plano:
                      <input
                        type="text"
                        name="numeroPlano"
                        value={formPaciente.numeroPlano}
                        onChange={handleChange}
                      />
                    </label>


                  </div>
                }
              </div>
              </div>

              <div className="div-form-cadastro-buttons">
                <button onSubmit={handleSubmit} className="button-geral-class">Cadastrar</button>
                <button type="submit" className="button-geral-class" onClick={() => {
                  navigate("/dashboard")
                }}>
                  Voltar
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PacienteCadastro;