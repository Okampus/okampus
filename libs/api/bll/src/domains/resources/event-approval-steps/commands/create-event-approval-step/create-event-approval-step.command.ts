import { Individual } from '@okampus/api/dal';
import { CreateEventApprovalStepDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class CreateEventApprovalStepCommand {
  constructor(
    public readonly createEventApprovalStep: CreateEventApprovalStepDto,
    public readonly tenant: TenantCore,
    public readonly requester: Individual
  ) {}
}