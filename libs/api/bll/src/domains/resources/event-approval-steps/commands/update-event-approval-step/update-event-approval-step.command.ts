import type { UpdateEventApprovalStepDto } from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';

export class UpdateEventApprovalStepCommand {
  constructor(
    public readonly updateEventApprovalStep: UpdateEventApprovalStepDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
