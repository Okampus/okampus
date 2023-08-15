type IsBranch<T> =
  // Is T an object?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends { [k: string]: any }
    ? // T is an object. Is it also an array?
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends any[]
      ? // T is an object, but also is an array. This is a leaf.
        never
      : // T is an object, but is not also an array. This is a branch.
        T
    : // T is not an object. This is a leaf.
      never;

// Recursively process each key.
// If it is a branch, process its keys and return the Partial of that branch.
// If it is a leaf, replace with the value type.
export type ModifyShapeType<S, T> = S extends IsBranch<S> ? Partial<{ [k in keyof S]: ModifyShapeType<S[k], T> }> : T;
