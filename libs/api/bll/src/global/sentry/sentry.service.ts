import { loadConfig } from '../../shards/utils/load-config';
import { ConfigService } from '@nestjs/config';
import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import Sentry from '@sentry/node';

import type { ApiConfig } from '@okampus/shared/types';
import type { NodeOptions } from '@sentry/node';

function onFatalError(logger: Logger, error: Error) {
  if (error.name === 'SentryError') {
    logger.error(error);
  } else {
    const client = Sentry.getCurrentHub().getClient();
    if (!client) throw new InternalServerErrorException('Sentry client is not initialized');

    client.captureException(error);
    logger.error('Fatal error occured. Application will be terminated');
  }
}

function beforeSend(event: Sentry.Event, hint: Sentry.EventHint) {
  const { originalException: exception } = hint;
  return exception instanceof HttpException && exception.getStatus() < 500 ? null : event;
}

@Injectable()
export class SentryService {
  logger = new Logger(SentryService.name);
  sentryOptions: NodeOptions;

  constructor(private readonly configService: ConfigService) {
    const { dsn, isEnabled: enabled } = loadConfig<ApiConfig['sentry']>(this.configService, 'sentry');
    const release = loadConfig<string>(this.configService, 'release');
    const environment = loadConfig<string>(this.configService, 'nodeEnv');

    const integrations = [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.OnUncaughtException({ onFatalError: (error) => onFatalError(this.logger, error) }),
      new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
    ];

    const debug = environment === 'production' ? false : true;
    this.sentryOptions = { dsn, debug, enabled, release, integrations, beforeSend, tracesSampleRate: 1, environment };
  }

  async init() {
    Sentry.init(this.sentryOptions);
  }

  async onApplicationShutdown() {
    await Sentry.close(1000);
  }
}
