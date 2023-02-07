import { Global, Injectable, Module } from '@nestjs/common';
import Sentry from '@sentry/node';
import { exit } from 'node:process';
import type { ClientOptions, Client } from '@sentry/types';
import type { NodeOptions } from '@sentry/node';
import type { DynamicModule } from '@nestjs/common';

const runOrGet = (value: unknown) => (typeof value === 'function' ? value() : value);

@Injectable()
export class SentryService {
  sentry: typeof Sentry;
  constructor(public readonly options: NodeOptions) {
    this.sentry = Sentry;
    const { integrations = [], ...sentryOptions } = options;
    this.sentry.init({
      ...sentryOptions,
      integrations: [
        new Sentry.Integrations.OnUncaughtException({
          onFatalError: async (error) => {
            if (error.name === 'SentryError') {
              console.log(error);
            } else {
              const client = Sentry.getCurrentHub().getClient() as Client<ClientOptions>;
              client.captureException(error);
              exit(1);
            }
          },
        }),
        new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
        ...runOrGet(integrations),
      ],
    });
  }

  async onApplicationShutdown() {
    await Sentry.close(1000);
  }
}

@Global()
@Module({})
export class SentryModule {
  static forRoot(options: NodeOptions): DynamicModule {
    const sentryProvider = {
      provide: SentryService,
      useValue: new SentryService(options),
    };

    return {
      module: SentryModule,
      providers: [sentryProvider],
      exports: [sentryProvider],
    };
  }
}
