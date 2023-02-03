export function processPopulatePaginated(populate: never[]): {
  getPageInfo: boolean;
  getCursor: boolean;
  populate: never[];
} {
  let getCursor = false;
  let getPageInfo = false;

  const pop = (populate as string[])
    .filter((str) => {
      if (str.includes('pageInfo')) {
        getPageInfo = true;
        return false;
      }

      if (str.includes('edges.cursor')) {
        getCursor = true;
        return false;
      }

      if (str === 'edges.node' || str === 'edges' || str === 'node') return false;
      return true;
    })
    .map((str) => {
      if (str.includes('edges.node.')) {
        return str.replace('edges.node.', '');
      }
      return str;
    }) as never[];

  return {
    getPageInfo,
    getCursor,
    populate: pop,
  };
}
