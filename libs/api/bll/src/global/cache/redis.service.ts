import { loadConfig } from '../../shards/utils/load-config';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import Redis from 'ioredis';

import type { HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class RedisService {
  client: Redis;

  constructor(private readonly configService: ConfigService) {
    const options = loadConfig(this.configService, 'redis');
    this.client = new Redis(options);
  }

  async checkHealth(name: string): Promise<HealthIndicatorResult> {
    return { [name]: { status: (await this.client.ping()) === 'PONG' ? 'up' : 'down' } };
  }
}
