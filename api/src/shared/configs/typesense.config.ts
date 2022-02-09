import { Client } from 'typesense';
import { config } from './config';

export const client = new Client({
  nodes: [{
    host: config.get('typesense.host'),
    port: config.get('typesense.port'),
    protocol: config.get('typesense.scheme'),
  }],
  apiKey: config.get('typesense.apiKey'),
  connectionTimeoutSeconds: 2,
  useServerSideSearchCache: true,
  cacheSearchResultsForSeconds: 5,
});
