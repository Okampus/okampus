import { RedisService } from './redis.service';

import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({ imports: [ConfigModule], providers: [RedisService], exports: [RedisService] })
export class RedisModule {}
