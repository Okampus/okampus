import type { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { config } from './config';

export const redisConnectionOptions = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
};

export default {
  readyLog: true,
  errorLog: true,
  config: redisConnectionOptions,
} as RedisModuleOptions;
