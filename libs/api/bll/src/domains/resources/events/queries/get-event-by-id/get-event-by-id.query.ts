import { UUID } from '@okampus/shared/types';
import { TenantCore } from '@okampus/api/dal';

export class GetEventByIdQuery {
  constructor(
    public readonly id: UUID,
    public readonly tenant: TenantCore,
    public readonly populate: never[] = ['tenant'] as never[]
  ) {}
}
