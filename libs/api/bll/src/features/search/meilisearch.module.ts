import { MeiliSearchService } from './meilisearch.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigModule, ConfigService } from '../../global/config.module';

import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Team, TenantCore, TenantEvent, User } from '@okampus/api/dal';

@Global()
@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([TenantCore, Team, User, TenantEvent])],
  providers: [MeiliSearchService],
  exports: [MeiliSearchService],
})
export class MeiliSearchModule {
  constructor(private readonly configService: ConfigService, private readonly meiliSearchService: MeiliSearchService) {}
  public async onModuleInit(): Promise<void> {
    if (this.configService.config.meilisearch.enabled) await this.meiliSearchService.init();
  }
}
