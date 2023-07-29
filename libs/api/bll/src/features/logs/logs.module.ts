import { LogsService } from './logs.service';
import { LogsResolver } from './logs.resolver';

import { MikroOrmModule } from '@mikro-orm/nestjs';

import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import { Event, Finance, Log, Team, Tenant } from '@okampus/api/dal';

@Global()
@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([Event, Finance, Log, Team, Tenant])],
  providers: [LogsService, LogsResolver],
  exports: [LogsService],
})
export class LogsModule {}
