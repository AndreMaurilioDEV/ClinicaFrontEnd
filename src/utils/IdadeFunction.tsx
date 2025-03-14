export const calcularIdade = (date: string): number => {
  const dataNascimento = new Date(date);
  const hoje = new Date();

  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = dataNascimento.getMonth();
  const diaAtual = hoje.getDate();
  const diaNascimento = dataNascimento.getDate();

  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
    idade--;
  }

  return idade;
};