export type NestedKeyOf<O extends Record<string, unknown>> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in Extract<keyof O, string>]: O[K] extends Array<any>
    ? K
    : O[K] extends Record<string, unknown>
    ? `${K}` | `${K}.${NestedKeyOf<O[K]>}`
    : K;
}[Extract<keyof O, string>];

export type DeepProperty<
  T extends Record<string, unknown>,
  P extends NestedKeyOf<T>
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? T[Key] extends object
      ? // @ts-ignore - TS doesn't like the recursive type
        DeepProperty<T[Key], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;
