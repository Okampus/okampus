const byteUnits = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
const octetUnits = ['octets', 'Ko', 'Mo', 'Go', 'To', 'Po'];

const getSize = (size: number) => size.toFixed(2).replace('.00', '');

export function bytes(size: number, separator = '.', units = byteUnits): string {
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    i++;
  }

  const sizeString = separator === '.' ? getSize(size) : getSize(size).replace('.', separator);
  return `${sizeString} ${units[i]}`;
}

export const formatAsBytes = (size: number) => bytes(size);
export const formatAsOctets = (size: number) => bytes(size, ',', octetUnits);
