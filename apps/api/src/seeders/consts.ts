import { rootPath } from '../config';
import path from 'node:path';

export const assetsFolder = path.join(rootPath, 'libs', 'assets', 'src');
export const customSeederFolder = path.join(rootPath, 'apps', 'api', 'src', 'seeders', 'custom');
