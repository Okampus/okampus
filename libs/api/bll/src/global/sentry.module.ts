// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigModule, ConfigService } from '../global/config.module';

import { ConsoleLogger, Global, HttpException, Injectable, Module } from '@nestjs/common';
import Sentry from '@sentry/node';

import { exit } from 'node:process';
import type { NodeOptions } from '@sentry/node';

import type { ClientOptions, Client } from '@sentry/types';

@Injectable()
export class SentryService {
  sentry: typeof Sentry | null = null;

  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new ConsoleLogger('Sentry');

  async init() {
    this.sentry = Sentry;
    const sentryOptions: NodeOptions = {
      dsn: this.configService.config.sentry.dsn,
      debug: false,
      enabled: this.configService.config.sentry.enabled,
      release: this.configService.config.release,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.OnUncaughtException({
          onFatalError: async (error) => {
            if (error.name === 'SentryError') {
              this.logger.error(error);
            } else {
              const client = Sentry.getCurrentHub().getClient() as Client<ClientOptions>;
              client.captureException(error);
              exit(1);
            }
          },
        }),
        new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
      ],
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
      environment: this.configService.config.nodeEnv,
    };

    this.sentry.init(sentryOptions);
  }

  async onApplicationShutdown() {
    if (this.sentry) await this.sentry.close(1000);
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [SentryService],
  exports: [SentryService],
})
export class SentryModule {
  constructor(private readonly configService: ConfigService, private readonly sentryService: SentryService) {}
  public async onModuleInit(): Promise<void> {
    if (this.configService.config.redis.enabled) await this.sentryService.init();
  }
}
