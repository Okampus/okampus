/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import moduleAlias from 'module-alias';

const commonPath = path.resolve(__dirname, '..', 'dist', 'common');
const modulesPath = path.resolve(__dirname, '..', 'dist', 'modules');

moduleAlias.addAliases({
  '@common': commonPath,
  '@lib': path.join(commonPath, 'lib'),
  '@configs': path.join(commonPath, 'configs'),

  '@modules': modulesPath,
  '@catalog': path.join(modulesPath, 'catalog'),
  '@create': path.join(modulesPath, 'create'),
  '@interact': path.join(modulesPath, 'interact'),
  '@org': path.join(modulesPath, 'org'),
  '@canteens': path.join(modulesPath, 'org', 'canteens'),
  '@classes': path.join(modulesPath, 'org', 'classes'),
  '@teams': path.join(modulesPath, 'org', 'teams'),
  '@tenants': path.join(modulesPath, 'org', 'tenants'),
  '@plan': path.join(modulesPath, 'plan'),
  '@uaa': path.join(modulesPath, 'uaa'),
  '@upload': path.join(modulesPath, 'upload'),
});
