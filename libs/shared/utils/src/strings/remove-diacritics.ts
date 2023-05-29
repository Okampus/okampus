export function removeDiacritics(str: string): string {
  return str.normalize('NFD').replaceAll(/\p{Diacritic}/gu, '');
}
