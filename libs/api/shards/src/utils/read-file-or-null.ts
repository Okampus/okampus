import { readFile, stat } from 'node:fs/promises';

export async function readFileOrNull(path: string) {
  if (!(await stat(path).catch(() => false))) return null;
  return await readFile(path);
}
