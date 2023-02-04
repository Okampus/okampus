import { UpdateTenantCommand } from './update-tenant.command';
import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';
import type { TenantModel } from '../../../../factories/domains/tenants/tenant.model';

@CommandHandler(UpdateTenantCommand)
export class UpdateTenantHandler implements ICommandHandler<UpdateTenantCommand> {
  constructor(private readonly tenantFactory: TenantFactory) {}

  async execute(command: UpdateTenantCommand): Promise<TenantModel> {
    const { id, ...updateTenant } = command.updateTenant;
    return await this.tenantFactory.updateActor({ id, tenant: command.tenant }, command.populate, updateTenant);
  }
}
