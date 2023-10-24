import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

export let rootPath = __dirname;
while (rootPath !== '/') {
  const filePath = join(rootPath, 'pnpm-lock.yaml');
  if (existsSync(filePath)) break;
  rootPath = dirname(rootPath);
}

if (rootPath === '/') throw new Error('Could not find project root path, exiting...');
console.debug('Project root path:', rootPath);
