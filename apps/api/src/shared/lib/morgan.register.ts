import morgan from 'morgan';
import status from 'statuses';

morgan.token('status-text', (_req, { statusCode }) => status(statusCode).toString());
morgan.token('status-colored', (_req, { statusCode }) => {
  const color = statusCode >= 500 ? 31 // Red
    : statusCode >= 400 ? 33 // Yellow
    : statusCode >= 300 ? 34 // Blue
    : statusCode >= 200 ? 36 // Cyan
    : 37; // White
  return `\u001B[${color}m${statusCode}\u001B[32m`;
});
