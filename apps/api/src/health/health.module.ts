import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MeiliSearchHealthIndicator } from '@common/modules/health/meilisearch.health';
import { StorageHealthIndicator } from '@common/modules/health/storage.health';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    RedisHealthModule,
  ],
  controllers: [HealthController],
  providers: [MeiliSearchHealthIndicator, StorageHealthIndicator],
  exports: [],
})
export class HealthModule {}
