import MeiliSearch from 'meilisearch';
import { config } from './config';

export const meiliSearchClient = new MeiliSearch({
  host: config.get('meilisearch.host'),
  apiKey: config.get('meilisearch.apiKey'),
});
