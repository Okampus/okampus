export type FileMimeCheckPayload = {
  mimetype: string;
  name?: string;
  stream?: () => ReadableStream<Uint8Array>;
};
