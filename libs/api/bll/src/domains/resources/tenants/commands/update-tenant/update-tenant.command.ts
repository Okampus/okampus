import type { UpdateTenantDto } from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';

export class UpdateTenantCommand {
  constructor(
    public readonly updateTenant: UpdateTenantDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
