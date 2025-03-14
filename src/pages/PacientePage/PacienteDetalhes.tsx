import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGet } from '../../api/api';
import './PacienteDetalhes.css';
import type { Paciente, ConsultaData } from '../../interface/Interfaces';
import { calcularIdade } from '../../utils/IdadeFunction';
import imgAvatar from '../../assets/avatar-padrao.png';
import { useFetchData } from '../../hooks/useFetchData';
import { formatarData, formatarHorario, formatarTipoAtendimento } from '../../utils/Formats';
import { Drawer, Button } from "@mui/material";
import { BsGenderNeuter } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { HiOutlineIdentification } from "react-icons/hi2";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { IoIosInformationCircle } from "react-icons/io";


function PacienteDetalhes() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [pacienteConsulta, setPacienteConsulta] = useState<ConsultaData[]>([]);
  const { data: consultas } = useFetchData<ConsultaData>('consultas');
  const [open, setOpen] = useState(false); // Estado para abrir/fechar o modal

  const toggleDrawer = (state: boolean) => {
    setOpen(state);
  };

  useEffect(() => {
    const handleGet = async () => {
      try {
        const data = await fetchGet(`pacientes/${id}`);
        setPaciente(data);
      } catch (error) {
        console.error("Erro ao buscar paciente:", error);
      }
    };

    if (id) {
      handleGet();
    }
  }, [id]);

  useEffect(() => {
    if (paciente && consultas) {
      const detalhesConsulta = consultas.filter(
        (item) => item.pacienteCpf === paciente.nome
      );
      setPacienteConsulta(detalhesConsulta);
    }
  }, [paciente, consultas]);

  if (!paciente) {
    return <p>Carregando...</p>;
  }

  const filterTipoAtendimento = (atendimento: string) => {
    const filterAtendimentoConsulta = pacienteConsulta?.filter((consulta) =>
      consulta.tipoAtendimento == atendimento
    );
    return filterAtendimentoConsulta;
  };

  const filterStatus = () => {
    const filterStatus = pacienteConsulta?.filter((consulta) =>
      consulta.status == "FALTOU"
    );
    return filterStatus.length;
  };

  const idadePaciente = calcularIdade(paciente.date);

  filterTipoAtendimento("CONSULTA")

  return (
    <>
      <h2>{paciente.nome}</h2>
      <section className="detalhes-sec">
        <div className="detalhes-div-flex">
          <div className="div-1">
            <img src={imgAvatar} alt="Imagem Avatar" />

            <div className="info">
              <h3>{paciente.nome}</h3>
              <p>{paciente.telefone}</p>
              <p>{idadePaciente} anos</p>
            </div>

            <div className='info'>
              <h3>Plano</h3>
              <p>{paciente.numeroPlano || "N/A"}</p>
            </div>

            <ul>
              <li><button onClick={() => toggleDrawer(true)} style={{
                display:'flex'
              }}>
                <span><IoIosInformationCircle/></span>
                Informações
                </button></li>
            </ul>
          </div>

          <div className="div-2">
            <div>
              <h3>Futuros agendamentos:</h3>
              {pacienteConsulta.length > 0 ? (
                pacienteConsulta.map((item, index) => (
                  <p key={index}>
                    {formatarTipoAtendimento(item.tipoAtendimento)} com {item.medicoNome} às {formatarHorario(item.horario)} em {formatarData(item.dateTime)}
                  </p>
                ))
              ) : (
                <p>Nenhuma consulta agendada.</p>
              )}
            </div>

            <div>
              <h3>Observações:</h3>
              <p>Paciente sensível a dor</p>
            </div>
          </div>

          <div className='detalhes-div-filtros'>

            <div className='detalhes-div-card'>
              <span>{filterTipoAtendimento("EXAME").length}</span>
              <p>Exames</p>
            </div>

            <div className='detalhes-div-card'>
              <span>{filterTipoAtendimento("CONSULTA").length}</span>
              <p>Consultas</p>
            </div>

            <div className='detalhes-div-card'>
              <span>{filterTipoAtendimento("PROCEDIMENTO").length}</span>
              <p>Procedimentos</p>
            </div>

            <div className='detalhes-div-card'>
              <span>{filterTipoAtendimento("RETORNO").length}</span>
              <p>Retorno</p>
            </div>

            <div className='detalhes-div-card'>
              <span>{filterStatus()}</span>
              <p>Cancelados/Faltas</p>
            </div>
          </div>
        </div>
        <Drawer
          anchor="right"
          open={open}
          onClose={() => toggleDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "15%", 
              padding: "20px",
              gap: '15px'
            },
          }}
        >

          <div>
          <h3>Sobre o Paciente</h3>
          </div>

          <div>
            <div className='div-flex-infos'>
              <span><BsGenderNeuter /></span>
              <strong>Gênero:</strong>
            </div>
            <p>{formatarTipoAtendimento(paciente.genero)}</p>
          </div>

          <div>
            <div className='div-flex-infos'>
              <span><IoLocationOutline /></span>
              <strong>CEP:</strong>
            </div>
            <p>{paciente?.cep}</p>
          </div>

          <div>
            <div className='div-flex-infos'>
              <span><IoLocationOutline /></span>
              <strong>Endereço:</strong>
            </div>
            <p>{paciente?.endereco} - {paciente.cidade}/{paciente.estado}</p>
          </div>

          <div>
            <div className='div-flex-infos'>
              <span><IoPhonePortraitOutline /></span>
              <strong>Celular:</strong>
            </div>
            <p>{paciente?.telefone}</p>
          </div>

          <div>
            <div className='div-flex-infos'>
              <span><HiOutlineIdentification /></span>
              <strong>CPF:</strong>
            </div>
            <p>{paciente?.cpf}</p>
          </div>

          <div>
            <div className='div-flex-infos'>
            <span><MdOutlineEmail/></span><strong>Email:</strong>
            </div>
            <p>{paciente.email}</p>
          </div>

          <div>
            <div className='div-flex-infos'>
            <span><HiOutlineIdentification /></span><strong>Plano:</strong>
            </div>
            <p>{paciente.numeroPlano || "N/A"}</p>
          </div>

          <div>
            <div className='div-flex-infos'>
            <strong>Número do Plano:</strong>
            </div>
            <p>{paciente.planoDeSaude || "N/A"}</p>
          </div>

          <div>
            <div className='div-flex-infos'>
            <span><CiCalendarDate /></span>
            <strong>Data de Cadastro</strong>
            </div>
            <p>{formatarData(paciente.dataCadastro)}</p>
          </div>

          <Button variant="contained" color="secondary" onClick={() => toggleDrawer(false)}>
            Fechar
          </Button>
          
        </Drawer>
      </section>
    </>
  );
}

export default PacienteDetalhes;
