import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '../../global/config.module';
import { HealthController } from './health.controller';

@Module({
  imports: [ConfigModule, TerminusModule, RedisHealthModule],
  controllers: [HealthController],
  // providers: [MeiliSearchHealthIndicator, StorageHealthIndicator],
  exports: [],
})
export class HealthModule {}
