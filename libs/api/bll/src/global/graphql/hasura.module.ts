import { HasuraService } from './hasura.service';
import { LogsModule } from '../logs/logs.module';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TeamMember, TenantMember } from '@okampus/api/dal';

@Module({
  imports: [ConfigModule, LogsModule, MikroOrmModule.forFeature([TeamMember, TenantMember])],
  providers: [HasuraService],
  exports: [HasuraService],
})
export class HasuraModule {}
