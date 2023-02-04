import type { Readable } from 'node:stream';

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const _buf: Uint8Array[] = [];

    stream.on('data', (chunk: Uint8Array) => {
      _buf.push(chunk);
    });
    // eslint-disable-next-line max-statements-per-line
    stream.on('end', () => {
      resolve(Buffer.concat(_buf));
    });
    stream.on('error', reject);
  });
}
