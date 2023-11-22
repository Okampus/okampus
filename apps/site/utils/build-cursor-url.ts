import { baseUrl, protocol } from '../config';

import { buildUrl } from '@okampus/shared/utils';

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

  return buildUrl(`${protocol}://${domain}.${baseUrl}${endpoint.replace('^/', '').replace('/$', '')}`, params);
}
