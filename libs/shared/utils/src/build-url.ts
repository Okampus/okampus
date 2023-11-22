export function buildUrl(base: string, paramsObj?: Record<string, string | number | boolean>) {
  const params = Object.entries(paramsObj || {})
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`)
    .join('&');

  return params ? `${base}?${params}` : base;
}
