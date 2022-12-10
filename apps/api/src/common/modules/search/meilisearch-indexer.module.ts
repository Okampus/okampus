import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { config } from '@configs/config';
import { MeiliSearchIndexerService } from './meilisearch-indexer.service';
import { SearchSubscriber } from './search.subscriber';

@Module({
  providers: [MeiliSearchIndexerService, SearchSubscriber],
  exports: [MeiliSearchIndexerService],
})
export class MeiliSearchIndexerModule implements OnModuleInit {
  constructor(private readonly meiliSearchService: MeiliSearchIndexerService) {}

  public async onModuleInit(): Promise<void> {
    if (config.meilisearch.enabled)
      await this.meiliSearchService.init();
  }
}
