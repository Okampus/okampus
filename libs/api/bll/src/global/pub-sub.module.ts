import { Global, Injectable, Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import type { DynamicModule } from '@nestjs/common';
import type { PubSubRedisOptions } from 'graphql-redis-subscriptions/dist/redis-pubsub';

@Injectable()
export class PubSubService {
  pubsub: RedisPubSub;
  constructor(connection: PubSubRedisOptions['connection']) {
    this.pubsub = new RedisPubSub({ connection });
  }
}

@Global()
@Module({})
export class PubSubModule {
  static forRoot(connection: PubSubRedisOptions['connection']): DynamicModule {
    const pubSubProvider = {
      provide: PubSubService,
      useValue: new PubSubService(connection),
    };

    return {
      module: PubSubModule,
      providers: [pubSubProvider],
      exports: [pubSubProvider],
    };
  }
}
