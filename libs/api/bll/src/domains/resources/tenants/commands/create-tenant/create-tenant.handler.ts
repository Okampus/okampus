import { InjectRepository } from '@mikro-orm/nestjs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Actor, BaseRepository } from '@okampus/api/dal';
import { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';
import { TenantModel } from '../../../../factories/domains/tenants/tenant.model';
import { CreateTenantCommand } from './create-tenant.command';

@CommandHandler(CreateTenantCommand)
export class CreateTenantHandler implements ICommandHandler<CreateTenantCommand> {
  constructor(
    private readonly tenantFactory: TenantFactory,
    @InjectRepository(Actor) private readonly actorRepository: BaseRepository<Actor>
  ) {}

  async execute(command: CreateTenantCommand): Promise<TenantModel> {
    return this.tenantFactory.createTenant(command.createTenant, command.individual);
  }
}
