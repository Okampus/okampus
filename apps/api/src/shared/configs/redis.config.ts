import type { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { config } from './config';

export const redisConnectionOptions = {
  host: config.get('redis.host'),
  port: config.get('redis.port'),
  password: config.get('redis.password'),
};

export default {
  readyLog: true,
  errorLog: true,
  config: redisConnectionOptions,
} as RedisModuleOptions;
