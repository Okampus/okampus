import { Kind } from 'graphql';
import type {
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  InlineFragmentNode,
  SelectionNode,
  DirectiveNode,
} from 'graphql';

type Node = FieldNode | FragmentDefinitionNode | InlineFragmentNode;

function getBooleanArgumentValue(info: GraphQLResolveInfo, ast: DirectiveNode) {
  const argument = ast.arguments?.[0].value;
  if (argument) {
    switch (argument.kind) {
      case Kind.BOOLEAN: {
        return argument.value;
      }
      case Kind.VARIABLE: {
        return !!info.variableValues[argument.name.value];
      }
    }
  }

  return false;
}

function isExcludedByDirective(info: GraphQLResolveInfo, ast: SelectionNode) {
  const directives = ast.directives || [];
  let isExcluded = false;
  for (const directive of directives) {
    switch (directive.name.value) {
      case 'include': {
        isExcluded = isExcluded || !getBooleanArgumentValue(info, directive);
        break;
      }
      case 'skip': {
        isExcluded = isExcluded || getBooleanArgumentValue(info, directive);
        break;
      }
    }
  }
  return isExcluded;
}

function dotConcat(a: string, b: string) {
  return a ? `${a}.${b}` : b;
}

type SelectionSetMap = { [key: string]: boolean };
function getSelectionSetMap(
  info: GraphQLResolveInfo,
  asts: readonly Node[] | Node = info.fieldNodes,
  prefix = ''
): SelectionSetMap {
  const nodes = Array.isArray(asts) ? asts : [asts];

  // eslint-disable-next-line unicorn/no-array-reduce
  const selections = nodes.reduce((selections: SelectionNode[], source: Node) => {
    if (source && source.selectionSet && source.selectionSet.selections)
      selections.push(...source.selectionSet.selections);
    return selections;
  }, []);

  // eslint-disable-next-line unicorn/no-array-reduce
  return selections.reduce((set: SelectionSetMap, ast: SelectionNode) => {
    if (isExcludedByDirective(info, ast)) return set;

    switch (ast.kind) {
      case Kind.FIELD: {
        const newPrefix = dotConcat(prefix, ast.name.value);
        if (ast.selectionSet) {
          return Object.assign({}, set, getSelectionSetMap(info, ast, newPrefix));
        } else {
          set[newPrefix] = true;
          return set;
        }
      }
      case Kind.INLINE_FRAGMENT: {
        return Object.assign({}, set, getSelectionSetMap(info, ast, prefix));
      }
      case Kind.FRAGMENT_SPREAD: {
        return Object.assign({}, set, getSelectionSetMap(info, info.fragments[ast.name.value], prefix));
      }
    }
  }, {});
}

export function getSelectionSet(info: GraphQLResolveInfo) {
  return Object.keys(getSelectionSetMap(info));
}
