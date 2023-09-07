export function isRequestFileData(req: { headers: Record<string, string | string[] | undefined> }) {
  return typeof req.headers['content-type'] === 'string'
    ? req.headers['content-type'].startsWith('multipart/form-data')
    : false;
}
