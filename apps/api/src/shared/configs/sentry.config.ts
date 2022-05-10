import type { SentryModuleOptions } from '@ntegral/nestjs-sentry';
import * as Sentry from '@sentry/node';
import { config } from './config';

export default {
  dsn: config.get('sentry.dsn'),
  debug: false,
  enabled: config.get('sentry.enabled'),
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  environment: config.get('nodeEnv'),
} as SentryModuleOptions;
