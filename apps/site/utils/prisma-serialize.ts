export type PrismaSerialize<T> = T extends bigint
  ? string
  : T extends Date
  ? number
  : T extends object
  ? { [K in keyof T]: PrismaSerialize<T[K]> }
  : T;

export type PrismaData<T> = PrismaSerialize<T> | T;

export function prismaSerialize(obj: unknown) {
  return JSON.stringify(obj, function (key, value) {
    if (typeof this[key] === 'bigint') return this[key].toString(); // Convert BigInt to string
    if (this[key] instanceof Date) return this[key].getTime(); // Convert Date to number
    return value;
  });
}
