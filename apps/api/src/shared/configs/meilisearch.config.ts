import type { Config as MeiliSearchConfig } from 'meilisearch';
import { config } from './config';

export default {
  host: config.meilisearch.host,
  apiKey: config.meilisearch.apiKey,
} as MeiliSearchConfig;
