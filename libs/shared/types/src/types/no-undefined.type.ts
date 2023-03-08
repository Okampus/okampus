export type NoUndefined<T> = Pick<
  T,
  {
    [property in keyof T]: T[property] extends undefined ? never : property;
  }[keyof T]
>;
