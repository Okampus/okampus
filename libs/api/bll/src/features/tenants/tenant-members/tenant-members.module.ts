import { TenantMembersService } from './tenant-members.service';
import {
  TenantMembersMutationResolver,
  TenantMembersQueryAggregateResolver,
  TenantMembersQueryResolver,
} from './tenant-members.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TenantMember } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TenantMember])],
  providers: [
    TenantMembersMutationResolver,
    TenantMembersQueryResolver,
    TenantMembersQueryAggregateResolver,
    TenantMembersService,
  ],
  exports: [TenantMembersService],
})
export class TenantMembersModule {}
