import { CreateTenantCommand } from './create-tenant.command';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CommandHandler } from '@nestjs/cqrs';
import { Actor } from '@okampus/api/dal';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { BaseRepository } from '@okampus/api/dal';
import type { TenantFactory } from '../../../../factories/domains/tenants/tenant.factory';
import type { TenantModel } from '../../../../factories/domains/tenants/tenant.model';

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
