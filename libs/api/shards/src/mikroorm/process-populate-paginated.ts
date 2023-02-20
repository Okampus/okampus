export function processPopulatePaginated(populatePaginated: readonly string[]): {
  getPageInfo: boolean;
  getCursor: boolean;
  populate: never[];
} {
  let getCursor = false;
  let getPageInfo = false;

  const populate: never[] = [];
  for (const str of populatePaginated) {
    if (str.includes('pageInfo')) getPageInfo = true;
    else if (str.includes('edges.cursor')) getCursor = true;
    else if (str.startsWith('edges.node.')) populate.push(<never>str.replace('edges.node.', ''));
  }

  return { getPageInfo, getCursor, populate };
}
