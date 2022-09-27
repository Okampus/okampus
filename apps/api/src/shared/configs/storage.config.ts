import { Logger } from '@nestjs/common';
import type { S3ModuleOptions } from 'nestjs-s3';
import { config } from './config';

const storageLogger = new Logger('ObjectStorage');
// See https://github.com/aws/aws-sdk-js/blob/1d56c096ae2f614a6127246269b9fac18e17bdc8/lib/event_listeners.js#L580
const awsLogRegex = /\[AWS (?<service>\w+) (?<statusCode>[\d\w]+) (?<time>[\d.]+)s (?<retries>\d+) retries\] (?<method>\w+)\(.*\)/isu;

export default {
  config: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
    endpoint: config.s3.endpoint,
    region: config.s3.region,
    signatureVersion: 'v4',
    maxRetries: 3,
    logger: {
      log: (message: string) => {
        const awsLog = awsLogRegex.exec(message)?.groups;
        storageLogger.log(`${awsLog?.method}: ${awsLog?.time}s - ${awsLog?.statusCode === 'undefined' ? '<Timed out>' : awsLog?.statusCode} [${awsLog?.retries} retries]`);
      },
    },
  },
} as S3ModuleOptions;
