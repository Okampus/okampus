import { DeleteTenantCommand } from './delete-tenant.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteTenantCommand)
export class DeleteTenantHandler implements ICommandHandler<DeleteTenantCommand> {
  constructor(private readonly tenantFactory: TenantFactory) {}

  async execute(command: DeleteTenantCommand): Promise<boolean> {
    return await this.tenantFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
