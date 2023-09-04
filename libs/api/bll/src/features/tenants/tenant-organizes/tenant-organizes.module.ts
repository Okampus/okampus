import { TenantOrganizesService } from './tenant-organizes.service';
import {
  TenantOrganizesMutationResolver,
  TenantOrganizesQueryAggregateResolver,
  TenantOrganizesQueryResolver
} from './tenant-organizes.resolver';
import { HasuraModule } from '../../../global/graphql/hasura.module';
import { LogsModule } from '../../../global/logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { TenantOrganize } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([TenantOrganize])],
  providers: [
    TenantOrganizesMutationResolver,
    TenantOrganizesQueryResolver,
    TenantOrganizesQueryAggregateResolver,
    TenantOrganizesService
  ],
  exports: [TenantOrganizesService],
})
export class TenantOrganizesModule {}