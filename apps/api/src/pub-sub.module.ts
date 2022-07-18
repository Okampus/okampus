import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { APP_PUB_SUB } from './shared/lib/constants';

@Global()
@Module({
  providers: [{ provide: APP_PUB_SUB, useValue: new PubSub() }],
  exports: [APP_PUB_SUB],
})
export class PubSubModule {}
