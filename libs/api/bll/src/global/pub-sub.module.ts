import { ConfigModule } from './config.module';
import { Global, Injectable, Module } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import type { ConfigService } from './config.module';

@Injectable()
export class PubSubService {
  pubsub: RedisPubSub;
  constructor(private readonly configService: ConfigService) {
    this.pubsub = new RedisPubSub({ connection: this.configService.redisConnectionOptions });
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [PubSubService],
  exports: [PubSubService],
})
export class PubSubModule {}
