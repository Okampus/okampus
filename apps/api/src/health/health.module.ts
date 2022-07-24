import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { StorageHealthIndicator } from '../shared/modules/health/storage.health';
import { TypesenseHealthIndicator } from '../shared/modules/health/typesense.health';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    RedisHealthModule,
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [
    TypesenseHealthIndicator,
    StorageHealthIndicator,
  ],
  exports: [],
})
export class HealthModule {}
