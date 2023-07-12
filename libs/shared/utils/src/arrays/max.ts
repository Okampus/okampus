export function max<T>(arr: T[], func: (value: T) => number): T | undefined {
  let maxValue = Number.NEGATIVE_INFINITY,
    maxIndex = 0;
  for (const [i, element] of arr.entries()) {
    const value = func(element);
    if (maxValue === undefined || value > maxValue) {
      maxValue = value;
      maxIndex = i;
    }
  }
  return arr[maxIndex];
}
