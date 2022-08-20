import MeiliSearch from 'meilisearch';
import { config } from './config';

export const meiliSearchClient = new MeiliSearch({
  host: config.meilisearch.host,
  apiKey: config.meilisearch.apiKey,
});
