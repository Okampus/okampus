import { SentryService } from './sentry.service';
import { loadConfig } from '../../shards/utils/load-config';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({ imports: [ConfigModule], providers: [SentryService], exports: [SentryService] })
export class SentryModule {
  constructor(
    private readonly configService: ConfigService,
    private readonly sentryService: SentryService,
  ) {}
  public async onModuleInit(): Promise<void> {
    if (loadConfig(this.configService, 'sentry.isEnabled')) await this.sentryService.init();
  }
}
