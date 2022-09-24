import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectSentry, SentryService } from '@xiifain/nestjs-sentry';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  constructor(
    @InjectSentry() private readonly sentry: SentryService,
  ) {}

  public use(req: FastifyRequest, res: FastifyReply, next: () => never): void {
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

    req.raw.on('close', () => {
      transaction.setHttpStatus(res.statusCode);
      transaction.finish();
    });

    next();
  }
}
