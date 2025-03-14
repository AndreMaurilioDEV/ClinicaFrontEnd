import axios from 'axios';

export const handleCepChange = async (
  cep: string,
  form: any,
  setForm: React.Dispatch<React.SetStateAction<any>>
) => {
  const formattedCep = cep.replace(/\D/g, ''); // Remove caracteres não numéricos
  setForm({ ...form, cep });

  if (formattedCep.length === 8) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${formattedCep}/json/`);
      if (!response.data.erro) {
        setForm({
          ...form,
          cep,
          estado: response.data.uf,
          cidade: response.data.localidade,
          endereco: response.data.logradouro
        });
      } else {
        alert('CEP não encontrado!');
      }
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
    }
  }
};
