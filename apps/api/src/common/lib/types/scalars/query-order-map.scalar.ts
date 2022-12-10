import type { QueryOrder } from '@mikro-orm/core';
import { GraphQLScalarType, Kind } from 'graphql';

export const QueryOrderMapScalar = new GraphQLScalarType({
  name: 'QueryOrderMap',
  description: 'QueryOrderMap custom scalar type',
  serialize(value: Record<string, QueryOrder>): Record<string, QueryOrder> {
    return value;
  },
  parseValue(value: Record<string, QueryOrder>): Record<string, QueryOrder> {
    return value;
  },
  parseLiteral(ast): Record<string, QueryOrder> | null {
    if (ast.kind === Kind.OBJECT) {
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
