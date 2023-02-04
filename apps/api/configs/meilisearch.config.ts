import { config } from './config';
import type { MeiliModuleAsyncOptions } from 'nestjs-meilisearch';

export default {
  useFactory: () => ({
    host: config.meilisearch.host,
    apiKey: config.meilisearch.apiKey,
  }),
} as MeiliModuleAsyncOptions;
