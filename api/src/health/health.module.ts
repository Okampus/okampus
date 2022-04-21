import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { MikroOrmHealthIndicator } from '../shared/modules/health/mikro-orm.health';
import { StorageHealthIndicator } from '../shared/modules/health/storage.health';
import { TypesenseHealthIndicator } from '../shared/modules/health/typesense.health';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [
    MikroOrmHealthIndicator,
    TypesenseHealthIndicator,
    StorageHealthIndicator,
  ],
  exports: [],
})
export class HealthModule {}
