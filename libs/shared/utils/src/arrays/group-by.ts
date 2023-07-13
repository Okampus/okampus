interface GroupByResult<M> {
  groups: Record<string, M[]>;
  leftOvers: M[];
}

export function groupBy<T, M>(
  documents: T[],
  filter: (document: T) => { key?: string; value: M | null }
): GroupByResult<M> {
  const result: GroupByResult<M> = {
    groups: {},
    leftOvers: [],
  };
  for (const document of documents) {
    const { key, value } = filter(document);
    if (!value) continue;

    if (!key) {
      result.leftOvers.push(value);
      continue;
    }

    if (result.groups[key]) {
      result.groups[key].push(value);
    } else {
      result.groups[key] = [value];
    }
  }
  return result;
}
