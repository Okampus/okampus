import { TenantsService } from './tenants.service';
import { TenantsResolver } from './tenants.resolver';
import { CreateTenantHandler } from './commands/create-tenant/create-tenant.handler';
import { GetTenantByIdHandler } from './queries/get-tenant-by-id/get-tenant-by-id.handler';
import { UpdateTenantHandler } from './commands/update-tenant/update-tenant.handler';
import { DeleteTenantHandler } from './commands/delete-tenant/delete-tenant.handler';
import { GetTenantBySlugHandler } from './queries/get-tenant-by-slug/get-tenant-by-slug.handler';
import { GetTenantsHandler } from './queries/get-tenants/get-tenants.handler';
import { Actor, Tenant } from '@okampus/api/dal';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

const commandHandlers = [CreateTenantHandler, UpdateTenantHandler, DeleteTenantHandler];
const queryHandlers = [GetTenantByIdHandler, GetTenantsHandler, GetTenantBySlugHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([Tenant, Actor])],
  providers: [TenantsResolver, TenantsService, ...commandHandlers, ...queryHandlers],
  exports: [TenantsService],
})
export class TenantsModule {}
