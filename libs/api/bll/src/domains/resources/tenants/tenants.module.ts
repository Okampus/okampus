import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsResolver } from './tenants.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Actor, Tenant } from '@okampus/api/dal';
import { CreateTenantHandler } from './commands/create-tenant/create-tenant.handler';
import { GetTenantByIdHandler } from './queries/get-tenant-by-id/get-tenant-by-id.handler';
import { UpdateTenantHandler } from './commands/update-tenant/update-tenant.handler';
import { DeleteTenantHandler } from './commands/delete-tenant/delete-tenant.handler';
import { GetTenantBySlugHandler } from './queries/get-tenant-by-slug/get-tenant-by-slug.handler';
import { GetTenantsHandler } from './queries/get-tenants/get-tenants.handler';

const commandHandlers = [CreateTenantHandler, UpdateTenantHandler, DeleteTenantHandler];
const queryHandlers = [GetTenantByIdHandler, GetTenantsHandler, GetTenantBySlugHandler];

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([Tenant, Actor])],
  providers: [TenantsResolver, TenantsService, ...commandHandlers, ...queryHandlers],
  exports: [TenantsService],
})
export class TenantsModule {}
