import logger from 'pino-http';
import { Injectable } from '@nestjs/common';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { NestMiddleware } from '@nestjs/common';

const pinoLogger = logger({
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    } else if (res.statusCode >= 300 && res.statusCode < 400) {
      return 'silent';
    }
    return 'info';
  },
});

@Injectable()
export class RestLoggerMiddleware implements NestMiddleware {
  public use(req: IncomingMessage, res: ServerResponse, next: () => never): void {
    pinoLogger(req, res, next);
  }
}
