import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';
import { DeleteTenantCommand } from './delete-tenant.command';

@CommandHandler(DeleteTenantCommand)
export class DeleteTenantHandler implements ICommandHandler<DeleteTenantCommand> {
  constructor(private readonly tenantFactory: TenantFactory) {}

  async execute(command: DeleteTenantCommand): Promise<boolean> {
    return await this.tenantFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
