export function getErrorMessage(error: unknown) {
  if (typeof error === 'object') {
    if (error === null) return 'Unexpected error: error is null at getErrorMessage.';
    if ('message' in error) return error.message;
    return error.toString();
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unexpected error: error is not an object or string at getErrorMessage.';
}
