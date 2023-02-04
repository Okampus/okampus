import { GraphQLScalarType, Kind } from 'graphql';
import type { QueryOrder } from '@mikro-orm/core';

export const QueryOrderMapScalar = new GraphQLScalarType({
  name: 'QueryOrderMap',
  description: 'QueryOrderMap custom scalar type',
  serialize(value: unknown): Record<string, QueryOrder> {
    return value as Record<string, QueryOrder>;
  },
  parseValue(value: unknown): Record<string, QueryOrder> {
    return value as Record<string, QueryOrder>;
  },
  parseLiteral(ast): Record<string, QueryOrder> | null {
    if (ast.kind === Kind.OBJECT) {
      // eslint-disable-next-line unicorn/no-array-reduce
      return ast.fields.reduce<Record<string, QueryOrder>>((acc, field) => {
        if (field.value.kind !== Kind.STRING && field.value.kind !== Kind.ENUM)
          throw new Error('QueryOrderMap values must be QueryOrder');

        acc[field.name.value.toString()] = field.value.value as QueryOrder;
        return acc;
      }, {});
    }
    // Invalid hard-coded value (not an object)
    return null;
  },
});
