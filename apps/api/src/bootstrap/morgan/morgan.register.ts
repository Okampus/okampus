import { statuses } from '@okampus/shared/consts';
import morgan from 'morgan';
import type { ANSI_BLUE, ANSI_CYAN, ANSI_RED, ANSI_WHITE, ANSI_YELLOW } from '@okampus/shared/consts';

type StatusColor = typeof ANSI_RED | typeof ANSI_YELLOW | typeof ANSI_BLUE | typeof ANSI_CYAN | typeof ANSI_WHITE;

const getColoredStatus = (color: StatusColor, statusCode: number) => `\u001B[${color}m${statusCode}\u001B[32m`;

morgan.token('status-text', (_req, { statusCode }) => statuses[statusCode] || `Unknown (${statusCode})`);
morgan.token('status-colored', (_req, { statusCode }) => {
  if (statusCode >= 500) return getColoredStatus(31, statusCode); // Red - Server Error
  if (statusCode >= 400) return getColoredStatus(33, statusCode); // Yellow - Client Error
  if (statusCode >= 300) return getColoredStatus(34, statusCode); // Blue - Redirect
  if (statusCode >= 200) return getColoredStatus(36, statusCode); // Cyan - Success
  return getColoredStatus(37, statusCode); // White - Informational
});
