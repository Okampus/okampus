import type { IncomingMessage, ServerResponse } from 'node:http';
import type { NestMiddleware } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import morgan from 'morgan';

@Injectable()
export class RestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('REST');

  public use(req: IncomingMessage, res: ServerResponse, next: () => never): void {
    morgan((tokens, req2, res2) => {
      const lineFactory = morgan.compile(
        ':method :url :response-time ms — :status-colored (:status-text)'
      );
      this.logger.log(`Request finished: ${lineFactory(tokens, req2, res2)}`);
      return null;
    })(req, res, next);
  }
}
