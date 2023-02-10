// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SentryService } from '../../global/sentry.module';
import { Injectable } from '@nestjs/common';

import type { IncomingMessage, ServerResponse } from 'node:http';
import type { NestMiddleware } from '@nestjs/common';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  constructor(private readonly sentryService: SentryService) {}

  public use(req: IncomingMessage, res: ServerResponse, next: () => never): void {
    const transaction = this.sentryService.sentry.startTransaction({
      op: 'request',
      name: req.url ?? 'No url provided',
    });

    this.sentryService.sentry.getCurrentHub().configureScope((scope) => {
      scope.addEventProcessor((event) => {
        event.request = { method: req.method, url: req.url };
        return event;
      });
    });

    this.sentryService.sentry.configureScope((scope) => {
      scope.setSpan(transaction);
    });

    req.on('close', () => {
      transaction.setHttpStatus(res.statusCode);
      transaction.finish();
    });

    next();
  }
}
