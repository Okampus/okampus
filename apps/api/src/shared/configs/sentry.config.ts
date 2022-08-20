import { HttpException } from '@nestjs/common';
import type { SentryInterceptorOptions, SentryModuleOptions } from '@ntegral/nestjs-sentry';
import * as Sentry from '@sentry/node';
import { config } from './config';

export default {
  dsn: config.sentry.dsn,
  debug: false,
  enabled: config.sentry.enabled,
  release: config.release,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  beforeSend: (event, hint) => {
    if (typeof hint !== 'undefined' && hint.originalException instanceof HttpException && hint.originalException.getStatus() < 500)
      return null;

    return event;
  },
  tracesSampleRate: 1,
  environment: config.nodeEnv,
} as SentryModuleOptions;

export const sentryInterceptorConfig: SentryInterceptorOptions = {};
