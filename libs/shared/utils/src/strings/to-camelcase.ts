export function toCamelCase(str: string) {
  return str
    .replaceAll(/^\w|[A-Z]|\b\w/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replaceAll(/\s+/g, '');
}
