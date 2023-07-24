export function unique<T>(arr: T[], predicate: (item: T) => unknown) {
  return arr.filter((item, index) => {
    const value = predicate(item);
    return arr.findIndex((item2) => predicate(item2) === value) === index;
  });
}
