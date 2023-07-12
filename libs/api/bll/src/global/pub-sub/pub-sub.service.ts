import { Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import type { PubSubRedisOptions } from 'graphql-redis-subscriptions/dist/redis-pubsub';

@Injectable()
export class PubSubService {
  pubsub: RedisPubSub;
  constructor(connection: PubSubRedisOptions['connection']) {
    this.pubsub = new RedisPubSub({ connection });
  }
}
