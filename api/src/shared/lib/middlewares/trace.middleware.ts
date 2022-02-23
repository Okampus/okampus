import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  constructor(
    @InjectSentry() private readonly sentry: SentryService,
  ) {}

  public use(req: Request, res: Response, next: NextFunction): void {
    const sentry = this.sentry.instance();

    const transaction = sentry.startTransaction({ op: 'request', name: req.url });

    sentry.getCurrentHub().configureScope((scope) => {
      scope.addEventProcessor((event) => {
        event.request = { method: req.method, url: req.url };
        return event;
      });
    });

    sentry.configureScope((scope) => {
      scope.setSpan(transaction);
    });

    req.on('close', () => {
      transaction.setHttpStatus(res.statusCode);
      transaction.finish();
    });

    next();
  }
}
