import type { IncomingMessage, ServerResponse } from 'node:http';
import type { NestMiddleware } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import type { NextFunction } from 'express';
import morgan from 'morgan';

@Injectable()
export class GraphqlLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('GraphQL');

  public use(req: IncomingMessage, res: ServerResponse, next: NextFunction): void {
    morgan((tokens, req2, res2) => {
      const lineFactory = morgan.compile(':gql-op-type :gql-op-name :response-time ms');
      this.logger.log(`Request finished: ${lineFactory(tokens, req2, res2)}`);
      return null;
    })(req, res, next);
  }
}
