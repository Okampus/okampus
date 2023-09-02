const possibleSeparators = ['.', ',', "'", '`', '’', '"', '”', '“', '´', '‘', '´', '‛', '‟', '′', '″', '‴', '⁗'];
const extractNumberRegex = new RegExp(
  `(?![${possibleSeparators.join('')}])[\\d${possibleSeparators.join('')}]*\\d`,
  'g',
);
const separatorRegex = new RegExp(`[${possibleSeparators.join('')}]`, 'g');

const isNumber = (char: string) => char >= '0' && char <= '9';
const maxDecimalPlaces = 4;

export function parsePositiveNumber(value: string): number | null {
  value = value.replaceAll(/\s/g, ''); // Remove all whitespaces
  const matches = new RegExp(extractNumberRegex).exec(value);
  if (!matches) return null;

  const match = matches[0];
  if (match.length === 1) return Number.parseInt(match);

  let lastSeparator;
  for (let i = 0; i < maxDecimalPlaces; i++) {
    const char = match[match.length - 2 - i]; // last number cannot be a separator, so we start from the second last
    if (isNumber(char)) continue;
    lastSeparator = char;
    break;
  }

  if (!lastSeparator || match.replaceAll(new RegExp(`[^${lastSeparator}]`, 'g'), '').length > 1)
    return Number.parseInt(match.replaceAll(separatorRegex, ''));

  const [numberPart, decimalPart] = match.split(lastSeparator);
  return (
    Number.parseInt(numberPart.replaceAll(separatorRegex, '')) +
    Number.parseInt(decimalPart.padEnd(maxDecimalPlaces, '0')) / 10 ** maxDecimalPlaces
  );
}

console.log(parsePositiveNumber('1.000,00')); // 1000
console.log(parsePositiveNumber('.01')); // 0.01
