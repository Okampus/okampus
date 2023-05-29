import { Injectable } from '@nestjs/common';

import Sentry from '@sentry/node';

import type { IncomingMessage, ServerResponse } from 'node:http';
import type { NestMiddleware } from '@nestjs/common';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  public use(req: IncomingMessage, res: ServerResponse, next: () => never): void {
    if (!Sentry) return next();

    const transaction = Sentry.startTransaction({ op: 'request', name: req.url ?? 'No url provided.' });

    Sentry.configureScope((scope) => scope.setSpan(transaction));
    Sentry.getCurrentHub().configureScope((scope) => {
      const request = { method: req.method, url: req.url };
      scope.addEventProcessor((event) => ({ ...event, request: { ...event.request, ...request } }));
    });

    req.on('close', () => {
      transaction.setHttpStatus(res.statusCode);
      transaction.finish();
    });

    next();
  }
}
