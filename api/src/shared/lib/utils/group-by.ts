interface GroupByResult<T, M> {
  groups: Record<string, { metadata: M; values: T[] }>;
  leftOvers: T[];
}

export function groupBy<T, M>(
  documents: T[],
  filter: (document: T) => { key: string | undefined; metadata: M },
): GroupByResult<T, M> {
  const result: GroupByResult<T, M> = {
    groups: {},
    leftOvers: [],
  };
  for (const document of documents) {
    const { key, metadata } = filter(document);
    if (!key) {
      result.leftOvers.push(document);
      continue;
    }

    if (!result.groups[key])
      result.groups[key] = { metadata, values: [] };

    result.groups[key].values.push(document);
  }
  return result;
}
