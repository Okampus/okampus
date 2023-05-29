export function dataURItoFile(dataURI: string, filename: string) {
  const byteString = Buffer.from(dataURI.split(',')[1], 'base64').toString('binary');
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  // eslint-disable-next-line unicorn/prefer-code-point
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

  return new File([ab], filename, { type: mimeString });
}
