export function buildUrl(base: string, paramsObj?: Record<string, string | number | boolean | undefined | null>) {
  const params = Object.entries(paramsObj || {})
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent('' + value)}`)
    .join('&');

  return params ? `${base}?${params}` : base;
}
