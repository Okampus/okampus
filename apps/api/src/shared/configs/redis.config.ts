import type { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { config } from './config';

export default {
  readyLog: true,
  errorLog: true,
  config: {
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    password: config.get('redis.password'),
  },
} as RedisModuleOptions;
