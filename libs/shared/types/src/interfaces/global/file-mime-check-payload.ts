export type FileMimeCheckPayload = {
  type: string;
  name?: string;
  stream?: () => ReadableStream<Uint8Array>;
};
