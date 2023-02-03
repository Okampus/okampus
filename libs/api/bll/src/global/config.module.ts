import { Module, Global, DynamicModule, Injectable } from '@nestjs/common';
import { ApiConfig, RedisConnectionConfig } from '@okampus/shared/types';

@Injectable()
export class ConfigService {
  constructor(public config: ApiConfig, public redisConnectionOptions: RedisConnectionConfig) {}
}

@Global()
@Module({})
export class ConfigModule {
  static forRoot(config: ApiConfig, redisConnectionOptions: RedisConnectionConfig): DynamicModule {
    const configProvider = {
      provide: ConfigService,
      useValue: new ConfigService(config, redisConnectionOptions),
    };

    return {
      module: ConfigModule,
      providers: [configProvider],
      exports: [configProvider],
    };
  }
}
