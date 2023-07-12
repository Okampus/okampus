import { HealthController } from './health.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

@Module({ imports: [ConfigModule, TerminusModule], controllers: [HealthController] })
export class HealthModule {}
