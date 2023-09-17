export function makeS3Url(bucket: string, key: string, config: { rawEndpoint: string; forcePathStyle: boolean }) {
  if (config.forcePathStyle) return `http://${config.rawEndpoint}/${bucket}/${key}`;
  return `https://${bucket}.${config.rawEndpoint}/${key}`;
}
