export function randomEnum<T extends object>(anEnum: T): T[keyof T] {
  const enumValues = Object.values(anEnum);
  return enumValues[Math.floor(Math.random() * enumValues.length)];
}
