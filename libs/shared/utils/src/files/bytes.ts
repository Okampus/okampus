const defaultByteUnit = 'B';
const units = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'].map((unitPrefix) => `${unitPrefix}${defaultByteUnit}`);

const getSize = (size: number) => size.toFixed(2).replace('.00', '');

export function bytes(size: number, separator = '.', byteUnit = 'B'): string {
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    i++;
  }

  const unit = byteUnit === defaultByteUnit ? units[i] : units[i].replace('B', byteUnit);
  const sizeString = separator === '.' ? getSize(size) : getSize(size).replace('.', separator);

  return `${sizeString} ${unit}`;
}
