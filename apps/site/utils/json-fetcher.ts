export const jsonFetcher = (url: string, init?: RequestInit) => fetch(url, init).then((response) => response.json());
