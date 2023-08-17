export function formatBicSwift(bicSwift: string) {
  if (!bicSwift) return '';
  return bicSwift
    .slice(0, 11)
    .replaceAll(/\s\s+/g, ' ')
    .replaceAll(/[^\da-z]/gi, '')
    .toUpperCase();
}
