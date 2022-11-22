import type { CacheModuleOptions } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { redisConnectionOptions } from './redis.config';

export default {
  store: redisStore,
  isGlobal: true,
  ...redisConnectionOptions,
} as CacheModuleOptions;
