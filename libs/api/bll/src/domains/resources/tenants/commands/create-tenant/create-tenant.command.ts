import type { CreateTenantDto } from '@okampus/shared/dtos';
import type { Individual } from '@okampus/api/dal';

export class CreateTenantCommand {
  constructor(public readonly createTenant: CreateTenantDto, public readonly individual: Individual) {}
}
