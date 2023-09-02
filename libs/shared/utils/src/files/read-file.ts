import { readFile as readFileAsync, stat } from 'node:fs/promises';

export async function readFile(path: string) {
  if (!(await stat(path).catch(() => false))) return null;
  return await readFileAsync(path);
}
