import { formatFiles, generateFiles, names, joinPathFragments } from '@nx/devkit';
import type { Tree } from '@nx/devkit';

function pluralize(str: string) {
  if (str.endsWith('s') || str.endsWith('sh') || str.endsWith('ch') || str.endsWith('x') || str.endsWith('z'))
    return str;
  if (str.endsWith('y')) return str.slice(0, -1) + 'ies';
  return str + 's';
}

export default async function (
  tree: Tree,
  schema: {
    name: string;
    subfolder?: string;
    pkColumns?: string[];
    expectRels?: string;
    expectIds?: string;
    tenantScoped?: boolean;
    folder?: string;
  }
) {
  const { className, propertyName } = names(schema.name);
  const { fileName, className: pluralClassName, propertyName: pluralPropertyName } = names(pluralize(schema.name));

  const subfolderPath = schema.subfolder ? `${schema.subfolder}/` : '';
  const expectedRels = schema.expectRels?.split(',').map((string) => string.trim()) || [];
  const expectedIds = schema.expectIds?.split(',').map((string) => string.trim()) || [];

  const substitutions = {
    template: '',
    fileName,
    className,
    propertyName,
    pluralClassName,
    pluralPropertyName,
    pkColumns: schema.pkColumns || ['id'],
    expectedRels,
    expectedIds,
    tenantScoped: schema.tenantScoped,
    subfolder: subfolderPath,
  };
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'templates'),
    `./libs/api/bll/src/${schema.folder || 'features'}/${subfolderPath}${fileName}`,
    substitutions
  );
  await formatFiles(tree);
}
