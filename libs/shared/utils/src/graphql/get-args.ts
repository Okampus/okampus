import { isNonNullType } from './is-non-null-type';
import { valueFromAST } from './get-value-from-ast';
import { GraphQLError, Kind, print } from 'graphql';

import type { GraphQLField, GraphQLDirective, FieldNode, DirectiveNode, ArgumentNode } from 'graphql';

export function getGraphQLArgs<T>(
  def: GraphQLField<unknown, unknown> | GraphQLDirective,
  node: FieldNode | DirectiveNode,
  variableValues?: Record<string, unknown> | null
): T {
  const coercedValues: Record<string, unknown> = {};

  // /* c8 ignore next */

  // const argumentNodes = (args = node.arguments) !== null && args !== void 0 ? args : [];
  // const argNodeMap = keyMap(argumentNodes, (arg) => arg.name.value);

  const argumentsNodes = node.arguments ?? [];
  const argNodeMap: Record<string, ArgumentNode> = {};
  for (const arg of argumentsNodes) argNodeMap[arg.name.value] = arg;

  for (const argDef of def.args) {
    const name = argDef.name;
    const argType = argDef.type;
    const argumentNode = argNodeMap[name];

    if (!argumentNode) {
      if (argDef.defaultValue !== undefined) {
        coercedValues[name] = argDef.defaultValue;
      } else if (isNonNullType(argType)) {
        throw new GraphQLError(
          `Argument "${name}" of required type "${JSON.stringify(argType)}" ` + 'was not provided.',
          {
            nodes: node,
          }
        );
      }

      continue;
    }

    const valueNode = argumentNode.value;
    let isNull = valueNode.kind === Kind.NULL;

    if (valueNode.kind === Kind.VARIABLE) {
      const variableName = valueNode.name.value;

      if (variableValues == null || !(variableName in variableValues)) {
        if (argDef.defaultValue !== undefined) {
          coercedValues[name] = argDef.defaultValue;
        } else if (isNonNullType(argType)) {
          throw new GraphQLError(
            `Argument "${name}" of required type "${JSON.stringify(argType)}" ` +
              `was provided the variable "$${variableName}" which was not provided a runtime value.`,
            {
              nodes: valueNode,
            }
          );
        }

        continue;
      }

      isNull = variableValues[variableName] == null;
    }

    if (isNull && isNonNullType(argType)) {
      throw new GraphQLError(
        `Argument "${name}" of non-null type "${JSON.stringify(argType)}" ` + 'must not be null.',
        {
          nodes: valueNode,
        }
      );
    }

    const coercedValue = valueFromAST(valueNode, argType, variableValues);

    if (coercedValue === undefined) {
      // Note: ValuesOfCorrectTypeRule validation should catch this before
      // execution. This is a runtime check to ensure execution does not
      // continue with an invalid argument value.
      throw new GraphQLError(`Argument "${name}" has invalid value ${print(valueNode)}.`, {
        nodes: valueNode,
      });
    }

    coercedValues[name] = coercedValue;
  }

  return coercedValues as T;
}
