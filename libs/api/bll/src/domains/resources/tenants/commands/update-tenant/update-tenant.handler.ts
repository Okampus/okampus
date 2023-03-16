import { UpdateTenantCommand } from './update-tenant.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TenantModel } from '../../../../factories/domains/tenants/tenant.model';

@CommandHandler(UpdateTenantCommand)
export class UpdateTenantHandler implements ICommandHandler<UpdateTenantCommand> {
  constructor(private readonly tenantFactory: TenantFactory) {}

  async execute(command: UpdateTenantCommand): Promise<TenantModel> {
    return await this.tenantFactory.updateTenant(
      command.updateTenant,
      command.requester,
      command.tenant,
      command.populate
    );
  }
}
