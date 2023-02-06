import type { Individual } from '@okampus/api/dal';
import type { CreateEventApprovalStepDto } from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';

export class CreateEventApprovalStepCommand {
  constructor(
    public readonly createEventApprovalStep: CreateEventApprovalStepDto,
    public readonly tenant: TenantCore,
    public readonly requester: Individual
  ) {}
}
