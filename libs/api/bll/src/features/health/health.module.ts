import { HealthController } from './health.controller';
import { ConfigModule } from '../../global/config.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [ConfigModule, TerminusModule],
  controllers: [HealthController],
  // providers: [MeiliSearchHealthIndicator, StorageHealthIndicator],
  exports: [],
})
export class HealthModule {}
