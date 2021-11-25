import { promises as fs } from 'node:fs';

interface FsError extends Error {
  code: string;
}

export async function dirExists(path: string): Promise<boolean> {
  try {
    await fs.stat(path);
    return true;
  } catch (error: unknown) {
    if ((error as FsError).code === 'ENOENT')
      return false;
    throw error;
  }
}
