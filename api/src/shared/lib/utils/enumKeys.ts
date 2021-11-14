export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).map(Number).filter(Number.isNaN) as K[];
}
