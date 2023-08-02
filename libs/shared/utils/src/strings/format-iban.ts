export function formatIBAN(iban: string) {
  if (!iban) return '';

  const cleanIban = iban
    .replaceAll(/\s\s+/g, ' ')
    .replaceAll(/[^\da-z]/gi, '')
    .toUpperCase();

  const parts = [];
  if (cleanIban.length > 0) parts.push(cleanIban.slice(0, 4));
  if (cleanIban.length > 4) parts.push(cleanIban.slice(4, 8));
  if (cleanIban.length > 8) parts.push(cleanIban.slice(8, 12));
  if (cleanIban.length > 12) parts.push(cleanIban.slice(12, 16));
  if (cleanIban.length > 16) parts.push(cleanIban.slice(16, 20));
  if (cleanIban.length > 20) parts.push(cleanIban.slice(20, 24));
  if (cleanIban.length > 24) parts.push(cleanIban.slice(24, 27));

  return parts.join(' ');
}
