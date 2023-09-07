export type NestedKeyOf<O extends Record<string, unknown>> = {
  [K in Extract<keyof O, string>]: O[K] extends Array<unknown>
    ? K
    : O[K] extends Record<string, unknown>
    ? `${K}` | `${K}.${NestedKeyOf<O[K]>}`
    : K;
}[Extract<keyof O, string>];

export type DeepProperty<
  T extends Record<string, unknown>,
  P extends NestedKeyOf<T>,
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? T[Key] extends Record<string, unknown>
      ? Rest extends NestedKeyOf<T[Key]>
        ? DeepProperty<T[Key], Rest>
        : never
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;
