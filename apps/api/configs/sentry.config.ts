import { config } from './config';
import { HttpException } from '@nestjs/common';
import Sentry from '@sentry/node';
import type { SentryInterceptorOptions, SentryModuleOptions } from '@xiifain/nestjs-sentry';

export const sentryConfig = {
  dsn: config.sentry.dsn,
  debug: false,
  enabled: config.sentry.enabled,
  release: config.release,
  integrations: [new Sentry.Integrations.Http({ tracing: true })],
  beforeSend: (event, hint) => {
    if (
      hint !== undefined &&
      hint.originalException instanceof HttpException &&
      hint.originalException.getStatus() < 500
    )
      return null;

    return event;
  },
  tracesSampleRate: 1,
  environment: config.nodeEnv,
} as SentryModuleOptions;

export const sentryInterceptorConfig: SentryInterceptorOptions = {};
