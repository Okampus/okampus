import type { Individual } from '@okampus/api/dal';
import type { CreateEventApprovalDto } from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';

export class CreateEventApprovalCommand {
  constructor(
    public readonly createEventApproval: CreateEventApprovalDto,
    public readonly tenant: TenantCore,
    public readonly requester: Individual
  ) {}
}
