export function uniqBy (arr, callback) {
  return arr.reduce((acc, v) => {
    if (!acc.some((x) => callback(v, x))) acc.push(v)
    return acc
  }, [])
}
