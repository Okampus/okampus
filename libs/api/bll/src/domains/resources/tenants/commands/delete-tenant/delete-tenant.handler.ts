import { DeleteTenantCommand } from './delete-tenant.command';
import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';

@CommandHandler(DeleteTenantCommand)
export class DeleteTenantHandler implements ICommandHandler<DeleteTenantCommand> {
  constructor(private readonly tenantFactory: TenantFactory) {}

  async execute(command: DeleteTenantCommand): Promise<boolean> {
    return await this.tenantFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
