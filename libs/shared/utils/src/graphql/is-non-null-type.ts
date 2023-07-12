import { GraphQLNonNull } from 'graphql';
import type { GraphQLNullableType } from 'graphql';

export function isNonNullType(type: GraphQLNullableType): type is GraphQLNonNull<GraphQLNullableType> {
  return type instanceof GraphQLNonNull;
}
