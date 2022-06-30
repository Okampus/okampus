import { Logger } from '@nestjs/common';
import { Client } from 'typesense';
import { config } from './config';

const typesenseLogger = new Logger('Typesense');

// @ts-expect-error: We add a custom .setLevel function for the logger to be compatible with Typesense's calls.
// eslint-disable-next-line @typescript-eslint/no-empty-function
typesenseLogger.setLevel = (): void => {};

// We remove .debug because Typesense's debug logs are too verbose, and their loglevel was handled by their
// custom logger which we don't support. So we do it manually.
// Maybe later we could make a PR to their repo to make their logger more pluggable, or make a custom logger that
// supports .setLevel.
// eslint-disable-next-line @typescript-eslint/no-empty-function
typesenseLogger.debug = (): void => {};

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
  logger: typesenseLogger,
});
