import { UUID } from '@okampus/shared/types';
import { TenantCore } from '@okampus/api/dal';

// TODO: add a delete reason and other metadata?
export class DeleteTenantCommand {
  constructor(public readonly id: UUID, public readonly tenant: TenantCore) {}
}
