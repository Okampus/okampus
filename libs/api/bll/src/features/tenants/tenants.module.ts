import { TenantsService } from './tenants.service';
import { 
  TenantsMutationResolver,
  TenantsQueryAggregateResolver, 
  TenantsQueryResolver
} from './tenants.resolver';
import { HasuraModule } from '../../global/graphql/hasura.module';
import { LogsModule } from '../logs/logs.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Tenant } from '@okampus/api/dal';

@Module({
  imports: [HasuraModule, LogsModule, MikroOrmModule.forFeature([Tenant])],
  providers: [
    TenantsMutationResolver,
    TenantsQueryResolver, 
    TenantsQueryAggregateResolver,
    TenantsService
  ],
  exports: [TenantsService],
})
export class TenantsModule {}