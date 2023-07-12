import { HasuraService } from './hasura.service';
import { LogsModule } from '../../features/logs/logs.module';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TeamMember } from '@okampus/api/dal';

@Module({
  imports: [ConfigModule, LogsModule, MikroOrmModule.forFeature([TeamMember])],
  providers: [HasuraService],
  exports: [HasuraService],
})
export class HasuraModule {}
