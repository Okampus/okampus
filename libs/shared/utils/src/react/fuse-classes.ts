export const fuseClasses = (...classes: (string | null | undefined)[]) => {
  return (classes.filter(Boolean) as string[]).map((str) => str.trim()).join(' ');
};
