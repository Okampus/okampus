import type { OnModuleInit } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { config } from '../../configs/config';
import { MeiliSearchGlobal } from './meilisearch.global';

@Module({
  providers: [MeiliSearchGlobal],
  exports: [MeiliSearchGlobal],
})
export class MeiliSearchModule implements OnModuleInit {
  constructor(private readonly meiliSearchGlobal: MeiliSearchGlobal) {}

  public async onModuleInit(): Promise<void> {
    if (config.get('meilisearch.enabled'))
      await this.meiliSearchGlobal.init();
  }
}
