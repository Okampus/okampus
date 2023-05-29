const numberSeparators = ['.', ',', "'", '`', '’', '"', '”', '“', '´', '‘', '´', '‛', '‟', '′', '″', '‴', '⁗'];
const extractNumberRegex = new RegExp(`(?![${numberSeparators.join('')}])[\\d${numberSeparators.join('')}]*\\d`, 'g');
const separatorRegex = new RegExp(`[${numberSeparators.join('')}]`, 'g');

const isNumber = (char: string) => char >= '0' && char <= '9';
const maxDecimalPlaces = 4;
export function extractPositiveNumber(value: string): number | null {
  const matches = value.replace(/\s/g, '').match(extractNumberRegex);
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

  if (!lastSeparator || match.replace(new RegExp(`[^${lastSeparator}]`, 'g'), '').length > 1)
    return Number.parseInt(match.replace(separatorRegex, ''));

  const [numberPart, decimalPart] = match.split(lastSeparator);
  return (
    Number.parseInt(numberPart.replace(separatorRegex, '')) +
    Number.parseInt(decimalPart.padEnd(maxDecimalPlaces, '0')) / 10 ** maxDecimalPlaces
  );
}
