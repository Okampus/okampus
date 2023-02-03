import { Module } from '@nestjs/common';
import { MeiliSearchIndexerService } from './meilisearch-indexer.service';
import { SearchSubscriber } from './search.subscriber';

@Module({
  providers: [MeiliSearchIndexerService, SearchSubscriber],
  exports: [MeiliSearchIndexerService],
}) // implements OnModuleInit
export class MeiliSearchIndexerModule {
  constructor(private readonly meiliSearchService: MeiliSearchIndexerService) {}

  // public async onModuleInit(): Promise<void> {
  //   if (config.meilisearch.enabled) await this.meiliSearchService.init();
  // }
}
