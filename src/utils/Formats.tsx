export const formatarTipoAtendimento = (tipo: string) => {
  return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
};

export const formatarHorario = (horario: string | null) => {
  return (horario ?? "00:00").slice(0, 5); 
};


export const formatarData = (dataIso: string) => {
  const [ano, mes, dia] = dataIso.split("T")[0].split("-"); 
  return `${dia}/${mes}/${ano}`;
};