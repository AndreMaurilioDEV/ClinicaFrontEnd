import React, { useState } from 'react';
import './DashboardPage.css';
import { useFetchData } from '../../hooks/useFetchData';
import { fetchStatus } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import type { ConsultaData } from '../../interface/Interfaces';
import dayjs from 'dayjs';
import {
  isHoje, isFuturoOuHoje, ordenarPorHorario, calcularTaxaComparecimento,
  calcularProfissionalMaisDemandado, calcularPacientesNovos, filtrarPorPeriodo
} from '../../utils/DashboardCalc';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const STATUS_BADGE: Record<string, { bg: string; color: string }> = {
  AGENDADO: { bg: '#e6f1fb', color: '#0c447c' },
  CONFIRMADO: { bg: '#eaf3de', color: '#27500a' },
  ATENDIDO: { bg: '#eaf3de', color: '#27500a' },
  FALTOU: { bg: '#fcebeb', color: '#791f1f' },
};

const Dashboard = () => {
  const { data: doutores } = useFetchData('medicos');
  const { data: pacientes } = useFetchData<any>('pacientes');
  const { data: consultas, refetch } = useFetchData<ConsultaData>('consultas');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [periodoGestao, setPeriodoGestao] = useState(30);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const todasConsultas = consultas ?? [];
  const todosPacientes = pacientes ?? [];

  const consultasHoje = todasConsultas.filter((c) => isHoje(c.dateTime));
  const aguardandoConfirmacao = consultasHoje.filter((c) => c.status === 'AGENDADO').length;
  const faltasHoje = consultasHoje.filter((c) => c.status === 'FALTOU').length;

  const proximosAtendimentos = ordenarPorHorario(
    todasConsultas.filter((c) => isFuturoOuHoje(c.dateTime) && c.status !== 'FALTOU' && c.status !== 'ATENDIDO')
  ).slice(0, 5);

  const handleAtualizarStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await fetchStatus(id, 'consultas/status-consulta', { status });
      enqueueSnackbar('Status atualizado!', { variant: 'success' });
      refetch();
    } catch (error) {
      enqueueSnackbar('Erro ao atualizar status.', { variant: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  const consultasPeriodo = filtrarPorPeriodo(todasConsultas, periodoGestao);
  const taxaComparecimento = calcularTaxaComparecimento(consultasPeriodo);
  const profissionalDestaque = calcularProfissionalMaisDemandado(consultasPeriodo);
  const pacientesNovos = calcularPacientesNovos(todosPacientes, periodoGestao);

  const dataTipoAtendimento = {
    labels: ['Consulta', 'Exame', 'Procedimento', 'Retorno', 'Encaixe'],
    datasets: [{
      data: ['CONSULTA', 'EXAME', 'PROCEDIMENTO', 'RETORNO', 'ENCAIXE'].map(
        (tipo) => consultasPeriodo.filter((c) => c.tipoAtendimento === tipo).length
      ),
      backgroundColor: ['#1e757a', '#0c447c', '#993556', '#854f0b', '#3c3489'],
      borderWidth: 0,
    }],
  };

  const medicosNomes = [...new Set(consultasPeriodo.map((c) => c.medicoNome))];
  const dataFaltasPorProfissional = {
    labels: medicosNomes,
    datasets: [{
      label: 'Faltas',
      data: medicosNomes.map(
        (nome) => consultasPeriodo.filter((c) => c.medicoNome === nome && c.status === 'FALTOU').length
      ),
      backgroundColor: '#e24b4a',
      borderRadius: 6,
    }],
  };

  const chartOptionsSemEixo = {
    responsive: true,
    plugins: { legend: { position: 'bottom' as const, labels: { font: { size: 11 } } } },
  };

  const chartOptionsBarra = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  return (
    <div className="dashboard-novo">

      <div className="dashboard-greeting">
        <h2>Olá, recepção</h2>
        <p>{dayjs().format('dddd, D [de] MMMM [de] YYYY')}</p>
      </div>

      <div className="dashboard-cards-hoje">
        <div className="dashboard-card-destaque" onClick={() => navigate('/consultas')}>
          <div className="dashboard-card-numero">{consultasHoje.length}</div>
          <div className="dashboard-card-label">Atendimentos hoje</div>
        </div>
        <div className="dashboard-card-secundario" onClick={() => navigate('/consultas')}>
          <div className="dashboard-card-numero" style={{ color: '#854f0b' }}>{aguardandoConfirmacao}</div>
          <div className="dashboard-card-label">Aguardando confirmação</div>
        </div>
        <div className="dashboard-card-secundario" onClick={() => navigate('/consultas')}>
          <div className="dashboard-card-numero" style={{ color: '#791f1f' }}>{faltasHoje}</div>
          <div className="dashboard-card-label">Falta(s) registrada(s) hoje</div>
        </div>
      </div>

      <div className="dashboard-proximos">
        <div className="dashboard-proximos-header">
          <span>Próximos atendimentos</span>
          <span className="dashboard-link" onClick={() => navigate('/consultas')}>Ver agenda completa</span>
        </div>

        {proximosAtendimentos.length === 0 ? (
          <p className="dashboard-vazio">Nenhum atendimento pendente.</p>
        ) : (
          proximosAtendimentos.map((item) => {
            const badge = STATUS_BADGE[item.status] ?? STATUS_BADGE.AGENDADO;
            return (
              <div className="dashboard-atendimento-item" key={item.id}>
                <div className="dashboard-atendimento-horario">{item.horario?.slice(0, 5)}</div>
                <div className="dashboard-atendimento-nome">
                  {item.pacienteNome} <span>— {item.medicoNome}</span>
                </div>
                <span className="dashboard-status-badge" style={{ background: badge.bg, color: badge.color }}>
                  {item.status}
                </span>
                {item.status === 'AGENDADO' && (
                  <button
                    className="dashboard-btn-confirmar"
                    disabled={updatingId === item.id}
                    onClick={() => handleAtualizarStatus(item.id, 'CONFIRMADO')}
                  >
                    {updatingId === item.id ? '...' : 'Confirmar'}
                  </button>
                )}
                {item.status === 'CONFIRMADO' && (
                  <button className="dashboard-btn-confirmado" disabled>Confirmado</button>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="dashboard-gestao-header">
        <span>Visão de gestão</span>
        <select
          value={periodoGestao}
          onChange={(e) => setPeriodoGestao(Number(e.target.value))}
          className="dashboard-periodo-select"
        >
          <option value={7}>Últimos 7 dias</option>
          <option value={15}>Últimos 15 dias</option>
          <option value={30}>Últimos 30 dias</option>
        </select>
      </div>

      <div className="dashboard-kpis">
        <div className="dashboard-kpi">
          <div className="dashboard-kpi-numero">{consultasPeriodo.length}</div>
          <div className="dashboard-kpi-label">Total de atendimentos</div>
        </div>
        <div className="dashboard-kpi">
          <div className="dashboard-kpi-numero" style={{ color: '#27500a' }}>{taxaComparecimento}%</div>
          <div className="dashboard-kpi-label">Taxa de comparecimento</div>
        </div>
        <div className="dashboard-kpi">
          <div className="dashboard-kpi-numero" style={{ color: '#0c447c' }}>{pacientesNovos}</div>
          <div className="dashboard-kpi-label">Pacientes novos</div>
        </div>
        <div className="dashboard-kpi">
          <div className="dashboard-kpi-numero dashboard-kpi-texto" style={{ color: '#993556' }}>{profissionalDestaque}</div>
          <div className="dashboard-kpi-label">Profissional mais demandado</div>
        </div>
      </div>

      <div className="dashboard-graficos">
        <div className="dashboard-grafico-card">
          <div className="dashboard-grafico-titulo">Atendimentos por tipo</div>
          <Pie data={dataTipoAtendimento} options={chartOptionsSemEixo} />
        </div>
        <div className="dashboard-grafico-card">
          <div className="dashboard-grafico-titulo">Faltas por profissional</div>
          <Bar data={dataFaltasPorProfissional} options={chartOptionsBarra} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;