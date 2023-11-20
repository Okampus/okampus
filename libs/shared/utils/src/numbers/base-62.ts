const BASE62_DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function toBase62(value: bigint): string {
  let result = '';
  let remainder = value;

  while (remainder > 0n) {
    const digit = remainder % 62n;
    remainder = remainder / 62n;
    result = BASE62_DIGITS[Number(digit)] + result;
  }

  return result;
}

export function fromBase62(value: string): bigint {
  let result = 0n;

  for (const element of value) {
    const digit = BigInt(BASE62_DIGITS.indexOf(element));
    result = result * 62n + digit;
  }

  return result;
}
