import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGet } from '../../api/api';
import './ClienteDetalhes.css';
import type { Paciente, ConsultaData } from '../../interface/Interfaces';
import { calcularIdade } from '../../utils/IdadeFunction';
import { getInitials, getColorForString } from '../../utils/Avatar';
import { useFetchData } from '../../hooks/useFetchData';
import { formatarData, formatarHorario, formatarTipoAtendimento } from '../../utils/Formats';
import { BsGenderNeuter } from "react-icons/bs";
import { IoLocationOutline, IoPhonePortraitOutline } from "react-icons/io5";
import { HiOutlineIdentification } from "react-icons/hi2";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  CONSULTA:     { bg: "#e6f1fb", color: "#0c447c" },
  RETORNO:      { bg: "#eaf3de", color: "#27500a" },
  EXAME:        { bg: "#fbeaf0", color: "#993556" },
  PROCEDIMENTO: { bg: "#faeeda", color: "#854f0b" },
  ENCAIXE:      { bg: "#eeedfe", color: "#3c3489" },
};

function PacienteDetalhes() {
  const { id } = useParams();
  const [paciente, setPaciente]               = useState<Paciente | null>(null);
  const [pacienteConsulta, setPacienteConsulta] = useState<ConsultaData[]>([]);
  const { data: consultas } = useFetchData<ConsultaData>('consultas');

  useEffect(() => {
    if (!id) return;
    const handleGet = async () => {
      try {
        const data = await fetchGet(`pacientes/${id}`);
        setPaciente(data);
      } catch (error) {
        console.error("Erro ao buscar paciente:", error);
      }
    };
    handleGet();
  }, [id]);

  useEffect(() => {
    if (paciente && consultas) {
      setPacienteConsulta(
        consultas.filter((item) => item.pacienteCpf === paciente.nome)
      );
    }
  }, [paciente, consultas]);

  if (!paciente) return <p>Carregando...</p>;

  const filterTipo   = (tipo: string) => pacienteConsulta.filter((c) => c.tipoAtendimento === tipo);
  const totalFaltas  = pacienteConsulta.filter((c) => c.status === 'FALTOU').length;
  const idadePaciente = calcularIdade(paciente.date);
  const avatarColor   = getColorForString(paciente.nome);
  const temPlano      = !!paciente.planoDeSaude;
  const planoColor    = temPlano ? getColorForString(paciente.planoDeSaude) : { bg: '#f1efe8', text: '#444441' };

  return (
    <section className="detalhes-sec">
      <div className="detalhes-div-flex">

        {/* Cabeçalho */}
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
              <span>{idadePaciente} anos</span>
              <span>·</span>
              <span>{formatarTipoAtendimento(paciente.genero)}</span>
            </div>
          </div>

          {temPlano && (
            <span
              className="detalhes-plano-badge-inline"
              style={{ background: planoColor.bg, color: planoColor.text }}
            >
              {paciente.planoDeSaude} · Nº {paciente.numeroPlano}
            </span>
          )}
          {!temPlano && (
            <span
              className="detalhes-plano-badge-inline"
              style={{ background: '#f1efe8', color: '#444441' }}
            >
              Sem plano
            </span>
          )}
        </div>

        {/* Contato + Endereço */}
        <div className="detalhes-div-2col">

          <div className="detalhes-card-info">
            <div className="detalhes-section-label">Contato</div>
            <div className="detalhes-info-row">
              <span className="detalhes-info-key"><IoPhonePortraitOutline /> Celular</span>
              <span className="detalhes-info-val">{paciente.telefone || '—'}</span>
            </div>
            <div className="detalhes-info-row">
              <span className="detalhes-info-key"><MdOutlineEmail /> Email</span>
              <span className="detalhes-info-val">{paciente.email || '—'}</span>
            </div>
            <div className="detalhes-info-row">
              <span className="detalhes-info-key"><HiOutlineIdentification /> CPF</span>
              <span className="detalhes-info-val">{paciente.cpf || '—'}</span>
            </div>
          </div>

          <div className="detalhes-card-info">
            <div className="detalhes-section-label">Endereço</div>
            <div className="detalhes-info-row">
              <span className="detalhes-info-key"><IoLocationOutline /> Logradouro</span>
              <span className="detalhes-info-val">{paciente.endereco || '—'}</span>
            </div>
            <div className="detalhes-info-row">
              <span className="detalhes-info-key"><IoLocationOutline /> Cidade/UF</span>
              <span className="detalhes-info-val">{paciente.cidade && paciente.estado ? `${paciente.cidade} / ${paciente.estado}` : '—'}</span>
            </div>
            <div className="detalhes-info-row">
              <span className="detalhes-info-key"><IoLocationOutline /> CEP</span>
              <span className="detalhes-info-val">{paciente.cep || '—'}</span>
            </div>
          </div>

        </div>

        {/* Contadores */}
        <div className="detalhes-div-filtros">
          <div className="detalhes-div-card" style={{ borderColor: STATUS_BADGE.EXAME.color }}>
            <span style={{ color: STATUS_BADGE.EXAME.color }}>{filterTipo("EXAME").length}</span>
            <p>Exames</p>
          </div>
          <div className="detalhes-div-card" style={{ borderColor: STATUS_BADGE.CONSULTA.color }}>
            <span style={{ color: STATUS_BADGE.CONSULTA.color }}>{filterTipo("CONSULTA").length}</span>
            <p>Consultas</p>
          </div>
          <div className="detalhes-div-card" style={{ borderColor: STATUS_BADGE.PROCEDIMENTO.color }}>
            <span style={{ color: STATUS_BADGE.PROCEDIMENTO.color }}>{filterTipo("PROCEDIMENTO").length}</span>
            <p>Procedimentos</p>
          </div>
          <div className="detalhes-div-card" style={{ borderColor: STATUS_BADGE.RETORNO.color }}>
            <span style={{ color: STATUS_BADGE.RETORNO.color }}>{filterTipo("RETORNO").length}</span>
            <p>Retornos</p>
          </div>
          <div className="detalhes-div-card" style={{ borderColor: "#791f1f" }}>
            <span style={{ color: "#791f1f" }}>{totalFaltas}</span>
            <p>Faltas</p>
          </div>
        </div>

        {/* Agendamentos + Observações */}
        <div className="detalhes-div-2col">

          <div className="detalhes-card-info">
            <div className="detalhes-section-label">Próximos agendamentos</div>
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
            <div className="detalhes-section-label">Observações</div>
            <p style={{ fontSize: '0.85rem', color: '#475467', lineHeight: 1.6, margin: 0 }}>
              Paciente sensível a dor.
            </p>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: '#98a2b3' }}>
              <CiCalendarDate />
              Cadastrado em {formatarData(paciente.dataCadastro)}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default PacienteDetalhes;