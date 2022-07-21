import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { APP_PUB_SUB } from '../../lib/constants';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: APP_PUB_SUB, useValue: new PubSub() },
  ],
  exports: [APP_PUB_SUB],
})
export class PubSubModule {}
