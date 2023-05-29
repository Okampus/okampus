// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { RedisService } from './redis.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({ imports: [ConfigModule], providers: [RedisService], exports: [RedisService] })
export class RedisModule {
  constructor(private readonly configService: ConfigService, private readonly redisService: RedisService) {}
  public async onModuleInit(): Promise<void> {
    if (this.configService.get('redis.isEnabled')) await this.redisService.init();
  }
}
