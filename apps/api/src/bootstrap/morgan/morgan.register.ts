import morgan from 'morgan';
import status from 'statuses';

const getColoredStatus = (color: 31 | 33 | 34 | 36 | 37, statusCode: number) =>
  `\u001B[${color}m${statusCode}\u001B[32m`;

morgan.token('status-text', (_req, { statusCode }) => status(statusCode).toString());
morgan.token('status-colored', (_req, { statusCode }) => {
  if (statusCode >= 500) return getColoredStatus(31, statusCode); // Red - Server Error
  if (statusCode >= 400) return getColoredStatus(33, statusCode); // Yellow - Client Error
  if (statusCode >= 300) return getColoredStatus(34, statusCode); // Blue - Redirect
  if (statusCode >= 200) return getColoredStatus(36, statusCode); // Cyan - Success
  return getColoredStatus(37, statusCode); // White - Informational
});
