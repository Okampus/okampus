export function randomEnum<T extends object>(tsEnum: T): T[keyof T] {
  const enumValues = Object.values(tsEnum);
  return enumValues[Math.floor(Math.random() * (enumValues.length / 2))];
}
