import { baseUrl, protocol } from '../config';

// TODO: add filter, sort, search, complex cursor
export type buildCursorUrlOptions = {
  domain: string;
  endpoint: string;
  cursor?: string | number | bigint;
  take?: number;
};

export function buildCursorUrl({ domain, endpoint, cursor, take }: buildCursorUrlOptions) {
  const params: Record<string, string> = {};
  if (cursor) params['lastCursor'] = cursor.toString();
  if (take) params['take'] = take.toString();
  // let url = `${protocol}://${domain}.${baseUrl}/${endpoint}?`;*
  const url = new URL(`${protocol}://${domain}.${baseUrl}/${endpoint}`);
  url.search = new URLSearchParams(params).toString();

  return url.toString();
}
