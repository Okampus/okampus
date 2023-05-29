import { loadConfig } from '../../shards/utils/load-config';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import Redis from 'ioredis';

import type { HealthIndicatorResult } from '@nestjs/terminus';
import type { ApiConfig } from '@okampus/shared/types';

const READY_EVENT = 'ready';
const END_EVENT = 'end';

@Injectable()
export class RedisService {
  client: Redis | null = null;

  constructor(private readonly configService: ConfigService) {}

  async init(): Promise<void> {
    const options = loadConfig<ApiConfig['redis']>(this.configService, 'redis');
    if (this.client) {
      if (this.client.status === READY_EVENT) return;
      if (this.client.status === END_EVENT) this.client = new Redis(options);
      await new Promise((resolve) => this.client && this.client.on(READY_EVENT, resolve));
    } else {
      this.client = new Redis(options);
    }
  }

  async checkHealth(name: string): Promise<HealthIndicatorResult> {
    if (!this.client) return { [name]: { status: 'down' } };
    return { [name]: { status: (await this.client.ping()) === 'PONG' ? 'up' : 'down' } };
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
