import type { CacheModuleAsyncOptions } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { config } from './config';

export default {
  useFactory: async () => ({
    store: await redisStore({
      // Store-specific configuration:
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password,
    }),
  }),
  isGlobal: true,
} as CacheModuleAsyncOptions;
