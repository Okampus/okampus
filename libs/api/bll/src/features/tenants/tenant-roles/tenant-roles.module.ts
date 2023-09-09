import { TenantRolesService } from './tenant-roles.service';
import {
  TenantRolesMutationResolver,
  TenantRolesQueryAggregateResolver,
  TenantRolesQueryResolver,
} from './tenant-roles.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TenantRole } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TenantRole])],
  providers: [
    TenantRolesMutationResolver,
    TenantRolesQueryResolver,
    TenantRolesQueryAggregateResolver,
    TenantRolesService,
  ],
  exports: [TenantRolesService],
})
export class TenantRolesModule {}
