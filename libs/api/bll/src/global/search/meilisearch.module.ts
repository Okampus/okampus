import { MeiliSearchService } from './meilisearch.service';

import { ConfigModule } from '@nestjs/config';

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
  constructor(private readonly meiliSearchService: MeiliSearchService) {}

  public async onModuleInit(): Promise<void> {
    await this.meiliSearchService.init();
  }
}
