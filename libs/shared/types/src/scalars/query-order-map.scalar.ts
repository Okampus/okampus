import { GraphQLScalarType, Kind } from 'graphql';
import { QueryOrder } from '@mikro-orm/core';

const isQueryOrder = (value: string): value is QueryOrder =>
  Object.values(QueryOrder)
    .map((v) => v.toString())
    .includes(value);

const isQueryOrderMap = (value: unknown): value is Record<string, QueryOrder> => {
  if (typeof value !== 'object' || value === null) return false;
  return Object.values(value).every(isQueryOrder);
};

export const QueryOrderMapScalar = new GraphQLScalarType({
  name: 'QueryOrderMap',
  description: 'QueryOrderMap custom scalar type',
  serialize(value: unknown): Record<string, QueryOrder> {
    if (!isQueryOrderMap(value)) throw new Error('QueryOrderMap values must be QueryOrder');
    return value;
  },
  parseValue(value: unknown): Record<string, QueryOrder> {
    if (!isQueryOrderMap(value)) throw new Error('QueryOrderMap values must be QueryOrder');
    return value;
  },
  parseLiteral(ast): Record<string, QueryOrder> | null {
    if (ast.kind === Kind.OBJECT) {
      const map: Record<string, QueryOrder> = {};

      for (const field of ast.fields) {
        if ((field.value.kind !== Kind.STRING && field.value.kind !== Kind.ENUM) || !isQueryOrder(field.value.value))
          throw new Error('QueryOrderMap values must be QueryOrder');

        map[field.name.value.toString()] = field.value.value;
      }
    }

    // Invalid hard-coded value (not an object)
    return null;
  },
});
