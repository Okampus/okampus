import { TenantCore } from '@okampus/api/dal';
import { UUID } from '@okampus/shared/types';

export class GetTenantByIdQuery {
  constructor(
    public readonly id: UUID,
    public readonly tenant: TenantCore,
    public readonly populate: never[] = ['tenant'] as never[]
  ) {}
}
