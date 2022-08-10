import { Global, Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { redisConnectionOptions } from '../../configs/redis.config';
import { APP_PUB_SUB } from '../../lib/constants';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: APP_PUB_SUB, useValue: new RedisPubSub({ connection: redisConnectionOptions }) },
  ],
  exports: [APP_PUB_SUB],
})
export class PubSubModule {}
