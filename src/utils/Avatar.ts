export const getInitials = (nome: string): string => {
  const partes = nome.trim().split(' ').filter(Boolean);
  if (partes.length === 0) return '';
  if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

const PALETTE = [
  { bg: '#eeedfe', text: '#3c3489' },
  { bg: '#e1f5ee', text: '#085041' },
  { bg: '#faece7', text: '#993c1d' },
  { bg: '#fbeaf0', text: '#993556' },
  { bg: '#e6f1fb', text: '#0c447c' },
  { bg: '#eaf3de', text: '#27500a' },
  { bg: '#faeeda', text: '#854f0b' },
];

export const getColorForString = (value: string) => {
  if (!value) return { bg: '#f1efe8', text: '#444441' };
  const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
};