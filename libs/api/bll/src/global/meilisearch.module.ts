import { Global, Injectable, Module } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import type { Config } from 'meilisearch';
import type { DynamicModule } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class MeiliSearchService {
  client: MeiliSearch;
  constructor(options: Config) {
    this.client = new MeiliSearch(options);
  }

  async checkHealth(name: string): Promise<HealthIndicatorResult> {
    const isAlive = await this.client.isHealthy();
    return {
      [name]: {
        status: isAlive ? 'up' : 'down',
      },
    };
  }
}

@Global()
@Module({})
export class MeiliSearchModule {
  static forRoot(options: Config): DynamicModule {
    const MeiliSearchProvider = {
      provide: MeiliSearchService,
      useValue: new MeiliSearchService(options),
    };

    return {
      module: MeiliSearchModule,
      providers: [MeiliSearchProvider],
      exports: [MeiliSearchProvider],
    };
  }
}
