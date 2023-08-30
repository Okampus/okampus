import { formatFiles, generateFiles, names, joinPathFragments } from '@nx/devkit';
import type { Tree } from '@nx/devkit';

function pluralize(str: string) {
  if (str.endsWith('s') || str.endsWith('sh') || str.endsWith('ch') || str.endsWith('x') || str.endsWith('z'))
    return str + 'es';
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
    settles?: string;
    tenantScoped?: 'false' | 'true';
    folder?: string;
  },
) {
  const { className, propertyName } = names(schema.name);
  const { fileName, className: pluralClassName, propertyName: pluralPropertyName } = names(pluralize(schema.name));

  const subfolderPath = schema.subfolder ? `${schema.subfolder}/` : '';
  const expectedRels = schema.expectRels?.split(',').map((string) => string.trim()) || [];
  const expectedIds = schema.expectIds?.split(',').map((string) => string.trim()) || [];

  const enums: string[] = [];

  const settles =
    schema.settles?.split(';').map((string) => {
      const parts = string
        .trim()
        .split('_')
        .map((string) => string.trim());

      const by = parts.find((part) => part.startsWith('by:'))?.replace('by:', '');
      const at = parts.find((part) => part.startsWith('at:'))?.replace('at:', '');
      const ifExpr = parts.find((part) => part.startsWith('if:'))?.replace('if:', '');
      if (!by || !at || !ifExpr) throw new Error(`Invalid by/at/ifClause expression: ${string}`);

      const enumMatches = ifExpr.matchAll(/enum!([^.]*)\./g) || [];
      for (const match of enumMatches) {
        if (!/^[A-Z]/.test(match[1])) throw new Error(`Invalid enum name: ${match[1]}`);
        if (!enums.includes(match[1])) enums.push(match[1]);
      }

      return { by, at, ifExpr: ifExpr.replaceAll('enum!', '') };
    }) || [];

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
    tenantScoped: schema.tenantScoped !== 'false',
    subfolder: subfolderPath,
    enums,
    settles,
  };
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'templates'),
    `./libs/api/bll/src/${schema.folder || 'features'}/${subfolderPath}${fileName}`,
    substitutions,
  );
  await formatFiles(tree);
}
