import { getSelectionSet } from './get-selection-set';
import { countChar } from '../../strings/count-char';
import type { GraphQLResolveInfo } from 'graphql';

export function gqlInfoToRelations(info: GraphQLResolveInfo, excludeFields: string[] = [], maxDepth = 8): string[] {
  const selectionSet = getSelectionSet(info);

  const relations = [
    ...new Set(
      selectionSet
        .filter(
          (string) =>
            string.includes('.') &&
            !string.includes('Aggregate') &&
            !excludeFields.some((excludeField) => string.includes(excludeField)) &&
            countChar(string, '.') <= maxDepth,
        )
        .map((string) => string.split(/\.(?=[^.]+$)/)[0]),
    ),
  ];

  return relations;
}
