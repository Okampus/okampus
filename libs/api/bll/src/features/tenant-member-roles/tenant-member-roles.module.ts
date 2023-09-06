import { TenantMemberRolesService } from './tenant-member-roles.service';
import {
  TenantMemberRolesMutationResolver,
  TenantMemberRolesQueryAggregateResolver,
  TenantMemberRolesQueryResolver
} from './tenant-member-roles.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { LogsModule } from '../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TenantMemberRole } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TenantMemberRole])],
  providers: [
    TenantMemberRolesMutationResolver,
    TenantMemberRolesQueryResolver,
    TenantMemberRolesQueryAggregateResolver,
    TenantMemberRolesService
  ],
  exports: [TenantMemberRolesService],
})
export class TenantMemberRolesModule {}