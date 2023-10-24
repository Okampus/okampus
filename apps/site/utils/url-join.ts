type Optional<T> = T | undefined | null;

const join = (a: Optional<string>, b: Optional<string>) => {
  if (!a) return b;
  if (!b) return a;
  return `${a.replace(/\/$/, '')}/${b.replace(/^\//, '')}`;
};

export function urlJoin(...args: Optional<string>[]) {
  return args.reduce((acc, curr) => join(acc, curr), '') || '';
}
