import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGet } from '../../api/api';
import './ClienteDetalhes.css';
import type { Paciente, ConsultaData } from '../../interface/Interfaces';
import { calcularIdade } from '../../utils/IdadeFunction';
import { getInitials, getColorForString } from '../../utils/Avatar';
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

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  CONSULTA: { bg: "#e6f1fb", color: "#0c447c" },
  RETORNO: { bg: "#eaf3de", color: "#27500a" },
  EXAME: { bg: "#fbeaf0", color: "#993556" },
  PROCEDIMENTO: { bg: "#faeeda", color: "#854f0b" },
  ENCAIXE: { bg: "#eeedfe", color: "#3c3489" },
};

function PacienteDetalhes() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [pacienteConsulta, setPacienteConsulta] = useState<ConsultaData[]>([]);
  const { data: consultas } = useFetchData<ConsultaData>('consultas');
  const [open, setOpen] = useState(false);

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
  const avatarColor = getColorForString(paciente.nome);
  const temPlano = !!paciente.planoDeSaude;
  const planoColor = temPlano ? getColorForString(paciente.planoDeSaude) : { bg: '#f1efe8', text: '#444441' };

  return (
    <>
      <section className="detalhes-sec">
        <div className="detalhes-div-flex">

          <div className="detalhes-card-header">
            <div
              className="detalhes-avatar"
              style={{ background: avatarColor.bg, color: avatarColor.text }}
            >
              {getInitials(paciente.nome)}
            </div>

            <div className="detalhes-info-principal">
              <h3>{paciente.nome}</h3>
              <div className="detalhes-info-linha">
                <span><IoPhonePortraitOutline /> {paciente.telefone}</span>
                <span><CiCalendarDate /> {idadePaciente} anos</span>
              </div>
            </div>

            <div className="detalhes-plano-badge">
              <span style={{ background: planoColor.bg, color: planoColor.text }}>
                {/* CORRIGIDO: badge mostra o nome do plano, não o número */}
                {temPlano ? paciente.planoDeSaude : "Sem plano"}
              </span>
            </div>

            <button className="detalhes-btn-info" onClick={() => toggleDrawer(true)}>
              <IoIosInformationCircle />
              Informações
            </button>
          </div>

          <div className="detalhes-div-filtros">
            <div className="detalhes-div-card" style={{ borderColor: STATUS_BADGE.EXAME.color }}>
              <span style={{ color: STATUS_BADGE.EXAME.color }}>{filterTipoAtendimento("EXAME").length}</span>
              <p>Exames</p>
            </div>

            <div className="detalhes-div-card" style={{ borderColor: STATUS_BADGE.CONSULTA.color }}>
              <span style={{ color: STATUS_BADGE.CONSULTA.color }}>{filterTipoAtendimento("CONSULTA").length}</span>
              <p>Consultas</p>
            </div>

            <div className="detalhes-div-card" style={{ borderColor: STATUS_BADGE.PROCEDIMENTO.color }}>
              <span style={{ color: STATUS_BADGE.PROCEDIMENTO.color }}>{filterTipoAtendimento("PROCEDIMENTO").length}</span>
              <p>Procedimentos</p>
            </div>

            <div className="detalhes-div-card" style={{ borderColor: STATUS_BADGE.RETORNO.color }}>
              <span style={{ color: STATUS_BADGE.RETORNO.color }}>{filterTipoAtendimento("RETORNO").length}</span>
              <p>Retornos</p>
            </div>

            <div className="detalhes-div-card" style={{ borderColor: "#791f1f" }}>
              <span style={{ color: "#791f1f" }}>{filterStatus()}</span>
              <p>Faltas</p>
            </div>
          </div>

          <div className="detalhes-div-2">
            <div className="detalhes-card-info">
              <h3>Próximos agendamentos</h3>
              {pacienteConsulta.length > 0 ? (
                pacienteConsulta.map((item, index) => {
                  const badge = STATUS_BADGE[item.tipoAtendimento] ?? STATUS_BADGE.CONSULTA;
                  return (
                    <div className="detalhes-agendamento-item" key={index}>
                      <span style={{ background: badge.bg, color: badge.color }}>
                        {formatarTipoAtendimento(item.tipoAtendimento)}
                      </span>
                      com {item.medicoNome} às {formatarHorario(item.horario)} em {formatarData(item.dateTime)}
                    </div>
                  );
                })
              ) : (
                <p className="detalhes-vazio">Nenhuma consulta agendada.</p>
              )}
            </div>

            <div className="detalhes-card-info">
              <h3>Observações</h3>
              <p>Cliente sensível a dor</p>
            </div>
          </div>
        </div>

        <Drawer
          anchor="right"
          open={open}
          onClose={() => toggleDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "320px",
              padding: "24px",
              gap: '15px'
            },
          }}
        >
          <div>
            <h3>Sobre o cliente</h3>
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
              <span><MdOutlineEmail /></span><strong>Email:</strong>
            </div>
            <p>{paciente.email}</p>
          </div>

          <div>
            <div className='div-flex-infos'>
              <span><HiOutlineIdentification /></span><strong>Plano:</strong>
            </div>
            {/* CORRIGIDO: Plano mostra o nome do plano */}
            <p>{paciente.planoDeSaude || "N/A"}</p>
          </div>

          <div>
            <div className='div-flex-infos'>
              <strong>Número do Plano:</strong>
            </div>
            {/* CORRIGIDO: Número do Plano mostra o número */}
            <p>{paciente.numeroPlano || "N/A"}</p>
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