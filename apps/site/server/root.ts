import debug from 'debug';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const debugLog = debug('okampus:root');
debug.enable('okampus:root');

const globalForRoot = globalThis as unknown as {
  rootPath: string | undefined;
};

const getRootPath = () => {
  let rootPath = __dirname;
  while (rootPath !== '/') {
    const filePath = join(rootPath, 'pnpm-lock.yaml');
    if (existsSync(filePath)) break;
    rootPath = dirname(rootPath);
  }

  debugLog(rootPath);
  if (rootPath === '/') throw new Error('Could not find project root path, exiting...');

  return rootPath;
};

const rootPath = globalForRoot.rootPath ?? getRootPath();
export default rootPath;
