export function fromBase64(str: string) {
  return Buffer.from(str, 'base64').toString();
}
