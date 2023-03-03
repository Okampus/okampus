export function enumKeys<T extends string, TEnumValue extends string>(enumVariable: { [key in T]: TEnumValue }): T[] {
  return Object.keys(enumVariable) as T[];
}
