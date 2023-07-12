import { PubSubService } from './pub-sub.service';
import { Global, Module } from '@nestjs/common';
import type { DynamicModule } from '@nestjs/common';
import type { PubSubRedisOptions } from 'graphql-redis-subscriptions/dist/redis-pubsub';

@Global()
@Module({})
export class PubSubModule {
  static forRoot(connection: PubSubRedisOptions['connection']): DynamicModule {
    const pubSubProvider = { provide: PubSubService, useValue: new PubSubService(connection) };
    return { module: PubSubModule, providers: [pubSubProvider], exports: [pubSubProvider] };
  }
}
