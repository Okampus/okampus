// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigModule, ConfigService } from '../global/config.module';

import { Global, Injectable, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import type { HealthIndicatorResult } from '@nestjs/terminus';

const READY_EVENT = 'ready';
const END_EVENT = 'end';

@Injectable()
export class RedisService {
  client: Redis | null = null;

  constructor(private readonly configService: ConfigService) {}

  async init(): Promise<void> {
    const options = {
      host: this.configService.config.redis.host,
      port: this.configService.config.redis.port,
      password: this.configService.config.redis.password,
    };

    if (!this.client) {
      this.client = new Redis(options);
      return;
    }

    if (this.client.status === READY_EVENT) return;
    if (this.client.status === END_EVENT) {
      this.client = new Redis(options);
    }
    await new Promise((resolve) => {
      if (this.client) this.client.on(READY_EVENT, resolve);
    });
  }

  async checkHealth(name: string): Promise<HealthIndicatorResult> {
    if (!this.client) return { [name]: { status: 'down' } };

    const isAlive = (await this.client.ping()) === 'PONG';
    return { [name]: { status: isAlive ? 'up' : 'down' } };
  }

  async destroy() {
    if (!this.client) return;

    if (this.client.status === END_EVENT) return;
    if (this.client.status === READY_EVENT) {
      await this.client.quit();
      return;
    }
    this.client.disconnect();
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {
  constructor(private readonly configService: ConfigService, private readonly redisService: RedisService) {}
  public async onModuleInit(): Promise<void> {
    if (this.configService.config.redis.enabled) await this.redisService.init();
  }
}
