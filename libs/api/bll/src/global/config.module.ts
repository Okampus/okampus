import { Module, Global, Injectable } from '@nestjs/common';
import type { DynamicModule } from '@nestjs/common';
import type { ApiConfig } from '@okampus/shared/types';

@Injectable()
export class ConfigService {
  constructor(public config: ApiConfig) {}
}

@Global()
@Module({})
export class ConfigModule {
  static forRoot(config: ApiConfig): DynamicModule {
    const configProvider = {
      provide: ConfigService,
      useValue: new ConfigService(config),
    };

    return {
      module: ConfigModule,
      providers: [configProvider],
      exports: [configProvider],
    };
  }
}
