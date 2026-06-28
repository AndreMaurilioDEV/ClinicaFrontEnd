import type { ConsultaData, PatientData } from '../interface/Interfaces';

export const isHoje = (dateTime: string): boolean => {
  const hoje = new Date().toISOString().split('T')[0];
  return dateTime.split('T')[0] === hoje;
};

export const isFuturoOuHoje = (dateTime: string): boolean => {
  const hoje = new Date().toISOString().split('T')[0];
  return dateTime.split('T')[0] >= hoje;
};

export const ordenarPorHorario = (consultas: ConsultaData[]): ConsultaData[] => {
  return [...consultas].sort((a, b) => (a.horario ?? '').localeCompare(b.horario ?? ''));
};

export const calcularTaxaComparecimento = (consultas: ConsultaData[]): number => {
  const atendidas = consultas.filter((c) => c.status === 'ATENDIDO').length;
  const faltas = consultas.filter((c) => c.status === 'FALTOU').length;
  const total = atendidas + faltas;
  if (total === 0) return 0;
  return Math.round((atendidas / total) * 100);
};

export const calcularProfissionalMaisDemandado = (consultas: ConsultaData[]): string => {
  if (consultas.length === 0) return '—';
  const contagem: Record<string, number> = {};
  consultas.forEach((c) => {
    contagem[c.medicoNome] = (contagem[c.medicoNome] || 0) + 1;
  });
  const ordenado = Object.entries(contagem).sort((a, b) => b[1] - a[1]);
  return ordenado[0]?.[0] ?? '—';
};

export const calcularPacientesNovos = (pacientes: PatientData[], dias: number): number => {
  const limite = new Date();
  limite.setDate(limite.getDate() - dias);
  return pacientes.filter((p: any) => p.dataCadastro && new Date(p.dataCadastro) >= limite).length;
};

export const filtrarPorPeriodo = (consultas: ConsultaData[], dias: number): ConsultaData[] => {
  const hoje = new Date();
  const limite = new Date();
  limite.setDate(hoje.getDate() - dias);
  return consultas.filter((c) => {
    const data = new Date(c.dateTime);
    return data >= limite && data <= hoje;
  });
};