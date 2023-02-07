import { config } from './config';
import type { RedisOptions } from 'ioredis';

export const redisOptions: RedisOptions = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
};
