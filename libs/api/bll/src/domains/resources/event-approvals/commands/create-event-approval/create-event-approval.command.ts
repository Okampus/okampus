import { Individual } from '@okampus/api/dal';
import { CreateEventApprovalDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class CreateEventApprovalCommand {
  constructor(
    public readonly createEventApproval: CreateEventApprovalDto,
    public readonly tenant: TenantCore,
    public readonly requester: Individual
  ) {}
}
