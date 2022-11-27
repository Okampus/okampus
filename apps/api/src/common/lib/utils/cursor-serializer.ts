export function decodeCursor(cursor: string): number | string {
  const [type, justCursor] = cursor.split('.');
  const parsed = Buffer.from(justCursor, 'base64').toString('utf8');

  if (type === '0')
    return parsed;
  else if (type === '1')
    return Number(parsed);

  throw new Error('Invalid cursor type');
}

export function encodeCursor(id: number | string): string {
  const encoded = Buffer.from(id.toString()).toString('base64');

  if (typeof id === 'string')
    return `0.${encoded}`;
  else if (typeof id === 'number')
    return `1.${encoded}`;

  throw new Error('Invalid cursor type');
}
