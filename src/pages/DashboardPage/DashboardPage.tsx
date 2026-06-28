import React, { useState, useEffect } from 'react';
import './DashboardPage.css';
import { FaRegCheckCircle } from "react-icons/fa";
import { useFetchData } from '../../hooks/useFetchData';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type Chart,
  type ChartData,
  type ChartOptions
} from 'chart.js';

import { Doughnut } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import type { ConsultaData } from '../../interface/Interfaces';
import dayjs from 'dayjs';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)


interface PacienteType {
  id: number;
  nome: string
  genero: string;
}

const Dashboard = () => {

  const { data: doutores } = useFetchData('medicos');
  const { data: pacientes } = useFetchData<PacienteType>('pacientes');
  const { data: consultas } = useFetchData<ConsultaData>('consultas');
  const [pacientesFiltrados, setPacientesFiltrados] = useState<PacienteType[]>([])

  const [selectDays, setSelectedDays] = useState(0);
  const [selectedMedico, setSelectedMedico] = useState('');

  const filterConsultas = (nomeMedico: string, dias: number | null) => {
    const nowDate = new Date();
    const lastDays = new Date();
    lastDays.setDate(nowDate.getDate() - (dias ?? 0));

    return consultas?.filter((consulta) => {
      const dataConsulta = new Date(consulta.dateTime);

      const filtroMedico = nomeMedico ? consulta.medicoNome === nomeMedico : true;

      const filtroData = dias ? dataConsulta >= lastDays && dataConsulta <= nowDate : true;

      return filtroMedico && filtroData;
    });
  };


  const filterStatus = (status: string) => {
    const consultasTotais = filterConsultas(selectedMedico, selectDays);
    const filterStatusConsulta = consultasTotais?.filter((consulta) =>
      consulta.status == status
    );
    return filterStatusConsulta;
  };


  const filterTipoAtendimento = (atendimento: string) => {
    const consultasTotais = filterConsultas(selectedMedico, selectDays);
    const filterAtendimentoConsulta = consultasTotais?.filter((consulta) =>
      consulta.tipoAtendimento == atendimento
    );
    return filterAtendimentoConsulta;
  };

  const filterPacienteGenero = (genero: string) => {
    const consultasTotais = filterConsultas(selectedMedico, selectDays);
    const filterGeneroConsulta = consultasTotais?.map((consulta) =>
      consulta.pacienteCpf
    );

    const teste = pacientes?.filter((item) => filterGeneroConsulta?.includes(item.nome)).filter((item) => item.genero == genero)

    return teste;
  }

  const filterPacientesPerMedico = () => {
    const consultasMedico = filterConsultas(selectedMedico, selectDays);
    const cpfsPacientes = [...new Set(consultasMedico?.map(consulta => consulta.pacienteCpf))];
    const pacienteFiltrado = pacientes?.filter(paciente => cpfsPacientes.includes(paciente.nome));
    if (pacienteFiltrado) {
      setPacientesFiltrados(pacienteFiltrado);
    }
  };

  useEffect(() => {
    filterPacientesPerMedico();
  }, [selectedMedico, selectDays, pacientes, consultas]);

  const FilterConsultasHoje = () => {
    const diaHoje = dayjs().format('YYYY-MM-DD');
    const consultasTotais = filterConsultas(selectedMedico, selectDays);
    const consultasHoje = consultasTotais?.filter((item) => item.dateTime == diaHoje )
    return consultasHoje;
  }

  const consultasTotais = filterConsultas(selectedMedico, selectDays);
  const consultasAgendadas = filterStatus("ATENDIDO");
  const consultasFaltas = filterStatus("FALTOU");

  const data: ChartData<'pie'> = {
    labels: ["Agendadas", "Atendidas", "Faltas"],
    datasets: [
      {
        label: 'Quantidade',
        data: [
          consultasTotais?.length || 0,
          consultasAgendadas?.length || 0,
          consultasFaltas?.length || 0
        ],
        backgroundColor: ['#1e757a', '#F9F9F9', '#FF6B6B'],
        borderColor: ['gray', 'gray', 'gray'],
        borderWidth: 1,
        hoverOffset: 2
      }
    ]
  };


  const dataAtendimento: ChartData<'pie'> = {
    labels: ["Encaixe", "Retorno", "Consulta"],
    datasets: [
      {
        label: 'Tipo de Consultas',
        data: [
          filterTipoAtendimento("ENCAIXE")?.length || 0,
          filterTipoAtendimento("RETORNO")?.length || 0,
          filterTipoAtendimento("CONSULTA")?.length || 0
        ],
        backgroundColor: ['#1e757a', '#F9F9F9', '#FF6B6B'],
        borderColor: ['gray', 'gray', 'gray'],
        borderWidth: 1,
        hoverOffset: 2
      }
    ]
  };


  const dataGenero: ChartData<'doughnut'> = {
    labels: ["Masculino", "Feminino", "Outro"],
    datasets: [
      {
        label: 'Gênero de Clientes',
        data: [
          filterPacienteGenero("MASCULINO")?.length || 0,
          filterPacienteGenero("FEMININO")?.length || 0,
          filterPacienteGenero("OUTRO")?.length || 0
        ],
        backgroundColor: ['#1e757a', '#F9F9F9', '#FF6B6B'],
        borderColor: ['gray', 'gray', 'gray'],
        borderWidth: 1,
        hoverOffset: 2
      },
    ],
  };

  const noDataPlugin = {
    id: 'noDataPlugin',
    afterDatasetDraw: (chart: Chart) => {
      const { ctx, data, chartArea: { top, bottom, left, right, width, height } } = chart;
      if (data.datasets.every(dataset => dataset.data.length === 0)) {
        ctx.save();
        ctx.fillStyle = 'rgb(102,102,102,0.5)';
        ctx.fillRect(left, top, width, height);
        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = 'black';
        ctx.fillText('NoData', left + width / 2, top + height / 2);
        ctx.restore();
      }
    }
  };

  const options: ChartOptions<'pie' | 'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Distribuição das Consultas',
        font: {
          size: 16,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const [selectedView, setSelectedView] = useState<string | null>(null);

  const handleSelect = (view: string) => {
    setSelectedView(view);
  };

  return (
    <div className="dashboard">
      <div className="content-dashboard">
        <div className='div-dashboard-filters'>
          <label>
            <span>Período:</span>
            <select
              name=""
              id=""
              onChange={(e) => setSelectedDays(Number(e.target.value ? Number(e.target.value) : null))}
              value={selectDays ?? ""}
              className='select-dash-filter'
            >
              <option value="">Geral</option>
              <option value="30">Últimos 30 dias</option>
              <option value="15">Últimos 15 dias</option>
              <option value="7">Últimos 7 dias</option>
            </select>
          </label>


          <label>
            <span>Profissional:</span>
            <select
              name=""
              value={selectedMedico}
              onChange={(e) => setSelectedMedico(e.target.value)}
              className='select-dash-filter'
            >
              <option value="">Geral</option>
              {doutores?.map((doutor: any) =>
                <option value={doutor.nome}>{doutor.nome}</option>
              )}
            </select>
          </label>
        </div>

        <div className='div-flex-relatorio-1' style={{
          gap: '20px'
        }}>
          <div className='dashboard-relatorios' style={{
            width: '50%'
          }}>
            <div className='dashboard-relatorios-card'>
              <div><span>{consultasTotais ? consultasTotais?.length : 0}</span></div>
              <div className='dashboard-relatorios-infos'>
                <i><FaRegCheckCircle /></i>
                <p>Clientes agendados</p>
              </div>
            </div>

            <div className='dashboard-relatorios-card'>
              <div>
                <span>{consultasAgendadas ? consultasAgendadas?.length : 0}</span>
              </div>
              <div>
                <div className='dashboard-relatorios-infos'>
                  <i><FaRegCheckCircle /></i>
                  <p>Clientes atendidos</p>
                </div>
              </div>
            </div>
            <div className='dashboard-relatorios-card'>
              <div><span>{consultasFaltas ? consultasFaltas.length : 0}</span></div>
              <div className='dashboard-relatorios-infos'>
                <i><FaRegCheckCircle /></i>
                <p>Clientes que faltaram</p>
              </div>
            </div>

          </div>

          <div className='div-pacientes'>
            <h3>Clientes recentes</h3>
            <div className='div-pacientes-details'>
              {pacientesFiltrados?.slice(0, 4)
                .map((item) => (
                  <div key={item.id}>
                    <p>{item.nome}</p>
                  </div>
                ))}

            </div>
          </div>

          <div className='div-consultas-hoje'>
            <h3>Atendimentos Hoje</h3>
            <div className='div-flex-consultas-hoje'>
            <div>
              <span style={{
                fontSize: '65px'
              }}>{FilterConsultasHoje()?.length}</span>
            </div>
            <div>
              <p>Cliente(s) aguardando</p>
            </div>
            </div>
          </div>
        </div>

        <div className='dashboard-relatorios'>

          <div className='dashboard-relatorios-card'>
            <Pie
              data={data}
              options={options}
            />
          </div>

          <div className='dashboard-relatorios-card'>
            <Doughnut
              data={dataGenero}
              options={options}
            />
          </div>

          <div className='dashboard-relatorios-card'>
            <Pie
              data={dataAtendimento}
              options={options}
            />
          </div>

        </div>
      </div>
      <div>
      </div>
    </div>

  );
};

export default Dashboard;