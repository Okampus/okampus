import { config } from './config';
import type { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import type { RedisConnectionConfig } from '@okampus/shared/types';

export const redisConnectionOptions: RedisConnectionConfig = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
};

export default {
  readyLog: true,
  errorLog: true,
  config: redisConnectionOptions,
} as RedisModuleOptions;
