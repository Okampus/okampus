import { MeiliSearchService } from './meilisearch.service';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Event, User, Team, Tenant } from '@okampus/api/dal';

@Global()
@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([Tenant, Team, User, Event])],
  providers: [MeiliSearchService],
  exports: [MeiliSearchService],
})
export class MeiliSearchModule {
  constructor(
    private readonly configService: ConfigService,
    private readonly meiliSearchService: MeiliSearchService,
  ) {}
  public async onModuleInit(): Promise<void> {
    if (this.configService.get('meilisearch.isEnabled')) await this.meiliSearchService.init();
  }
}
