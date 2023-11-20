export function isRequestFileData(request: { headers: Record<string, string | string[] | undefined> }) {
  return typeof request.headers['content-type'] === 'string'
    ? request.headers['content-type'].startsWith('multipart/form-data')
    : false;
}
