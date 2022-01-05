import { Client } from 'typesense';
import { config } from './config';

export const client = new Client({
  nodes: [{
    host: 'localhost',
    port: 8108,
    protocol: 'http',
  }],
  apiKey: config.get('typesenseApiKey'),
  connectionTimeoutSeconds: 2,
  useServerSideSearchCache: true,
  cacheSearchResultsForSeconds: 5,
});
