import morgan from 'morgan';
import { Injectable, Logger } from '@nestjs/common';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { NestMiddleware } from '@nestjs/common';

@Injectable()
export class RestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('REST');

  public use(req: IncomingMessage, res: ServerResponse, next: () => never): void {
    morgan((tokens, request, response) => {
      const lineFactory = morgan.compile(':method :url :response-time ms — :status-colored (:status-text)');
      this.logger.log(`Request finished: ${lineFactory(tokens, request, response)}`);
      return null;
    })(req, res, next);
  }
}
