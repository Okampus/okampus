import { Client } from 'typesense';
import { config } from './config';

export const client = new Client({
  nodes: [{
    host: config.get('typesenseHost'),
    port: config.get('typesensePort'),
    protocol: 'http',
  }],
  apiKey: config.get('typesenseApiKey'),
  connectionTimeoutSeconds: 2,
  useServerSideSearchCache: true,
  cacheSearchResultsForSeconds: 5,
});
