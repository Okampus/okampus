import { LogsService } from './logs.service';
import { LogsResolver } from './logs.resolver';

import { MikroOrmModule } from '@mikro-orm/nestjs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigModule } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

import { Log, Team } from '@okampus/api/dal';

@Global()
@Module({
  imports: [ConfigModule, MikroOrmModule.forFeature([Log, Team])],
  providers: [LogsService, LogsResolver],
  exports: [LogsService],
})
export class LogsModule {}
