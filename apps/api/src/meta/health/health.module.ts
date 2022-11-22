import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MeiliSearchHealthIndicator } from '../shared/modules/health/meilisearch.health';
import { StorageHealthIndicator } from '../shared/modules/health/storage.health';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    RedisHealthModule,
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [MeiliSearchHealthIndicator, StorageHealthIndicator],
  exports: [],
})
export class HealthModule {}
