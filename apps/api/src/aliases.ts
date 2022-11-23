/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import moduleAlias from 'module-alias';

const commonPath = path.resolve(__dirname, '..', 'dist', 'common');
const modulesPath = path.resolve(__dirname, '..', 'dist', 'modules');
moduleAlias.addAliases({
  '@common': commonPath,
  '@modules': modulesPath,
});
