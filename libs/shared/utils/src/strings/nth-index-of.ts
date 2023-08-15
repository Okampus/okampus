export function nthIndexOf(string: string, pattern: string, n: number) {
  const L = string.length;
  let idx = -1;
  while (n-- && idx++ < L) {
    idx = string.indexOf(pattern, idx);
    if (idx < 0) break;
  }
  return idx;
}
