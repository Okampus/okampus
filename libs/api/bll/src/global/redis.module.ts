import { Global, Injectable, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import type { RedisOptions } from 'ioredis';
import type { DynamicModule } from '@nestjs/common';
import type { HealthIndicatorResult } from '@nestjs/terminus';

const READY_EVENT = 'ready';
const END_EVENT = 'end';

@Injectable()
export class RedisService {
  client: Redis;
  constructor(options: RedisOptions) {
    this.client = new Redis(options);
  }

  async checkHealth(name: string): Promise<HealthIndicatorResult> {
    const isAlive = (await this.client.ping()) === 'PONG';
    return {
      [name]: {
        status: isAlive ? 'up' : 'down',
      },
    };
  }

  async destroy() {
    if (this.client.status === END_EVENT) return;
    if (this.client.status === READY_EVENT) {
      await this.client.quit();
      return;
    }
    this.client.disconnect();
  }
}

@Global()
@Module({})
export class RedisModule {
  static forRoot(options: RedisOptions): DynamicModule {
    const redisProvider = {
      provide: RedisService,
      useValue: new RedisService(options),
    };

    return {
      module: RedisModule,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
