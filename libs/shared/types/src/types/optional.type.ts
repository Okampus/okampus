export type OptionalKeys<T> = keyof {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : Record<string, unknown> extends Pick<T, K>
    ? K
    : never]: 0;
};
