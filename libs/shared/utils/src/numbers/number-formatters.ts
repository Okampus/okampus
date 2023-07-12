const fmtCurrencyWithSign = new Intl.NumberFormat('fr', {
  style: 'currency',
  currency: 'EUR',
  signDisplay: 'always',
  maximumFractionDigits: 2,
});

const fmtCurrency = new Intl.NumberFormat('fr', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
});

export const formatCurrencyWithSign = (value: number): string =>
  fmtCurrencyWithSign.format(value).replace(/^(\D+)/, '$1 ');
export const formatCurrency = (value: number): string => fmtCurrency.format(value).replace('-', '- ');
