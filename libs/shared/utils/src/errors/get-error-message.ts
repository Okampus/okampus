export function getErrorMessage(error: unknown) {
  return 'message' in (error as Record<string, unknown>)
    ? (error as Record<string, unknown>).message
    : Object.prototype.toString.call(error);
}
