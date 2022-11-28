export const colorStringTransform = (
  { value }: { value: string },
): string => (value.startsWith('#') ? value.slice(1) : value);
