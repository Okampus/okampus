import { isNonNullType } from './is-non-null-type';
import { GraphQLEnumType, GraphQLError, GraphQLInputObjectType, GraphQLList, GraphQLScalarType, Kind } from 'graphql';
import type { ValueNode, GraphQLType, ObjectFieldNode, GraphQLInputType } from 'graphql';

export function isInputObjectType(type: GraphQLType): type is GraphQLInputObjectType {
  return type instanceof GraphQLInputObjectType;
}

export function isListType(type: GraphQLType): type is GraphQLList<GraphQLInputType> {
  return type instanceof GraphQLList;
}

export function isEnumType(type: GraphQLType): type is GraphQLEnumType {
  return type instanceof GraphQLEnumType;
}

export function isScalarType(type: GraphQLType): type is GraphQLScalarType {
  return type instanceof GraphQLScalarType;
}

export class GraphQLEnum {
  constructor(readonly value: string) {}

  toString() {
    return this.value;
  }
}

export function valueFromAST(
  valueNode: ValueNode | null | undefined,
  type: GraphQLType,
  variables?: Record<string, unknown> | null
): unknown | undefined {
  if (!valueNode) return; // Invalid

  if (valueNode.kind === Kind.VARIABLE) {
    const variableName = valueNode.name.value;
    if (variables == null || variables[variableName] === undefined) return; // Invalid

    const variableValue = variables[variableName];
    if (variableValue === null && isNonNullType(type)) return; // Invalid
    return variableValue;
  }

  if (isNonNullType(type)) {
    if (valueNode.kind === Kind.NULL) return; // Invalid
    return valueFromAST(valueNode, type.ofType, variables);
  }

  if (valueNode.kind === Kind.NULL) return null; // Explicitly return the value null.

  if (isListType(type)) {
    const itemType = type.ofType;

    if (valueNode.kind === Kind.LIST) {
      const coercedValues = [];

      for (const itemNode of valueNode.values) {
        if (itemNode.kind === Kind.VARIABLE && (variables == null || variables[itemNode.name.value] === undefined)) {
          // If an array contains a missing variable, it is either coerced to
          // null or if the item type is non-null, it considered invalid.
          if (isNonNullType(itemType)) return; // Invalid

          coercedValues.push(null);
        } else {
          const itemValue = valueFromAST(itemNode, itemType, variables);
          if (itemValue === undefined) return; // Invalid
          coercedValues.push(itemValue);
        }
      }

      return coercedValues;
    }

    const coercedValue = valueFromAST(valueNode, itemType, variables);
    if (coercedValue === undefined) return; // Invalid
    return [coercedValue];
  }

  if (isInputObjectType(type)) {
    if (valueNode.kind !== Kind.OBJECT) return; // Invalid: intentionally return no value.

    const coercedObj = Object.create(null);
    const fieldNodes: Record<string, ObjectFieldNode> = {};
    for (const fieldNode of valueNode.fields) fieldNodes[fieldNode.name.value] = fieldNode;

    for (const field of Object.values(type.getFields())) {
      const fieldNode = fieldNodes[field.name];

      if (
        !fieldNode ||
        (fieldNode.value.kind === Kind.VARIABLE &&
          (variables == null || variables[fieldNode.value.name.value] === undefined))
      ) {
        if (field.defaultValue !== undefined) {
          coercedObj[field.name] = field.defaultValue;
        } else if (isNonNullType(field.type)) {
          return; // Invalid: intentionally return no value.
        }

        continue;
      }

      const fieldValue = valueFromAST(fieldNode.value, field.type, variables);

      if (fieldValue === undefined) {
        return; // Invalid: intentionally return no value.
      }

      coercedObj[field.name] = fieldValue;
    }

    return coercedObj;
  }

  if (isEnumType(type)) {
    if (valueNode.kind !== Kind.ENUM) return; // Invalid
    return new GraphQLEnum(valueNode.value);
  }

  if (isScalarType(type)) {
    // Scalars and Enums fulfill parsing a literal value via parseLiteral().
    // Invalid values represent a failure to parse correctly, in which case
    // no value is returned.
    let result;

    try {
      result = type.parseLiteral(valueNode, variables);
    } catch {
      return; // Invalid
    }

    if (result === undefined) return; // Invalid
    return result;
  }

  throw new GraphQLError('Unexpected input type: ' + JSON.stringify(type));
} // Returns true if the provided valueNode is a variable which is not defined
// in the set of variables.
