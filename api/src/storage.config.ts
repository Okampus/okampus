import { Logger } from '@nestjs/common';
import type { ClientConfiguration } from 'aws-sdk/clients/s3';
import { config } from './config';

const s3Logger = new Logger('ObjectStorage');

export default {
  accessKeyId: config.get('storageAccessKeyId'),
  secretAccessKey: config.get('storageSecretAccessKey'),
  endpoint: config.get('storageEndpoint'),
  region: config.get('storageRegion'),
  signatureVersion: 'v4',
  logger: s3Logger,
} as ClientConfiguration;
