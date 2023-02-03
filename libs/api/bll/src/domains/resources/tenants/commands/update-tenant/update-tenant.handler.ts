import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';
import { TenantModel } from '../../../../factories/domains/tenants/tenant.model';
import { UpdateTenantCommand } from './update-tenant.command';

@CommandHandler(UpdateTenantCommand)
export class UpdateTenantHandler implements ICommandHandler<UpdateTenantCommand> {
  constructor(private readonly tenantFactory: TenantFactory) {}

  async execute(command: UpdateTenantCommand): Promise<TenantModel> {
    const { id, ...updateTenant } = command.updateTenant;
    return await this.tenantFactory.updateActor({ id, tenant: command.tenant }, command.populate, updateTenant);
  }
}