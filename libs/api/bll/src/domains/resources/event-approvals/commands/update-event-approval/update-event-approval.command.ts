import type { UpdateEventApprovalDto } from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';

export class UpdateEventApprovalCommand {
  constructor(
    public readonly updateEventApproval: UpdateEventApprovalDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
