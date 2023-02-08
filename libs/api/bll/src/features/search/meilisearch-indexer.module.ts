import { MeiliSearchIndexerService } from './meilisearch-indexer.service';
import { ConfigModule } from '../../global/config.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule],
  providers: [MeiliSearchIndexerService],
  exports: [MeiliSearchIndexerService],
}) // implements OnModuleInit
export class MeiliSearchIndexerModule {
  // constructor(private readonly meiliSearchService: MeiliSearchIndexerService) {}
  // public async onModuleInit(): Promise<void> {
  //   if (config.meilisearch.enabled) await this.meiliSearchService.init();
  // }
}
