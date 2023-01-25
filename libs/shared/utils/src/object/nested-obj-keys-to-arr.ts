export function nestedObjKeysToArr(obj: Record<string, unknown>, path: string[] = [], join = '.'): string[] {
  const arr = [];
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const newPath = [...path, key];
    if (typeof value === 'object' && value !== null) {
      arr.push(...nestedObjKeysToArr(value as Record<string, unknown>, newPath));
    } else {
      arr.push(newPath.join(join));
    }
  }

  console.log('arr', arr);
  return arr;
}
