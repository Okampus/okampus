import { Logger } from '@nestjs/common';
import type { S3ModuleOptions } from 'nestjs-s3';
import { config } from './config';

const storageLogger = new Logger('ObjectStorage');
// See https://github.com/aws/aws-sdk-js/blob/1d56c096ae2f614a6127246269b9fac18e17bdc8/lib/event_listeners.js#L580
const awsLogRegex = /\[AWS (?<service>\w+) (?<statusCode>\d+) (?<time>[\d.]+)s (?<retries>\d+) retries\] (?<method>\w+)\(.*\)/isu;

export default {
  config: {
    accessKeyId: config.get('storage.accessKeyId'),
    secretAccessKey: config.get('storage.secretAccessKey'),
    endpoint: config.get('storage.endpoint'),
    region: config.get('storage.region'),
    signatureVersion: 'v4',
    logger: {
      log: (message: string) => {
        if (config.get('nodeEnv') === 'development') {
          storageLogger.log(message);
        } else {
          const awsLog = awsLogRegex.exec(message)?.groups;
          storageLogger.log(`${awsLog?.method}: ${awsLog?.time}s - ${awsLog?.statusCode} [${awsLog?.retries} retries]`);
        }
      },
    },
  },
} as S3ModuleOptions;
