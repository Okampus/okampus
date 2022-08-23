import type { MeiliModuleAsyncOptions } from 'nestjs-meilisearch';
import { config } from './config';

export default {
  useFactory: () => ({
    host: config.meilisearch.host,
    apiKey: config.meilisearch.apiKey,
  }),
} as MeiliModuleAsyncOptions;
