
export interface CommonData {
  id: number;
  nome: string;
}

export interface DoctorData extends CommonData {
  crm: string;
}

export interface PatientData extends CommonData {
  cpf: string;
  genero: string;
}

export interface ConsultaData extends CommonData {
  id: number;
  dateTime: string; 
  horario: string | null; 
  medicoNome: string;
  medicoCrm: string;  
  pacienteNome: string;
  pacienteCpf: string;
  status: string;
  tipoAtendimento: string;
}

export interface Paciente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  genero: 'MASCULINO' | 'FEMININO' | 'OUTRO'; 
  dataCadastro: string; 
  date: string; 
  ativo: boolean;
  cep: string;
  cidade: string;
  estado: string;
  endereco: string;
  planoDeSaude: string;
  numeroPlano: string;
}
