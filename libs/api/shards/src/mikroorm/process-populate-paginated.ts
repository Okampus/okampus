export function processPopulatePaginated(populatePaginated: readonly string[]): {
  getPageInfo: boolean;
  getCursor: boolean;
  populate: never[];
} {
  let getCursor = false;
  let getPageInfo = false;

  const populate: never[] = [];
  for (const str in populatePaginated) {
    if (str.includes('pageInfo')) getPageInfo = true;
    if (str.includes('edges.cursor')) getCursor = true;
    if (str.startsWith('edges.node.')) populate.push(<never>str.replace('edges.node.', ''));
  }

  return { getPageInfo, getCursor, populate };
}
