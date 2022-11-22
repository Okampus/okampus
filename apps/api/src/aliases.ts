/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import moduleAlias from 'module-alias';

const metaPath = path.resolve(__dirname, '..', 'dist', 'meta');
const modulesPath = path.resolve(__dirname, '..', 'dist', 'modules');
moduleAlias.addAliases({
  '@meta': metaPath,
  '@modules': modulesPath,
});
