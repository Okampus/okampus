import { Logger } from '@nestjs/common';
import type { ClientConfiguration } from 'aws-sdk/clients/s3';
import { config } from './config';

const storageLogger = new Logger('ObjectStorage');

export default {
  accessKeyId: config.get('storage.accessKeyId'),
  secretAccessKey: config.get('storage.secretAccessKey'),
  endpoint: config.get('storage.endpoint'),
  region: config.get('storage.region'),
  signatureVersion: 'v4',
  logger: storageLogger,
} as ClientConfiguration;
