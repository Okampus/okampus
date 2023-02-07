import { config } from './config';
import type { Config } from 'meilisearch';

export default {
  host: config.meilisearch.host,
  apiKey: config.meilisearch.apiKey,
} as Config;
