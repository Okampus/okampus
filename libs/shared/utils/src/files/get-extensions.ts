export function getExtension(fileName: string | undefined | null) {
  if (!fileName) return '';
  if (!fileName.includes('.')) return '';
  return `.${fileName.split('.').pop()}`;
}
