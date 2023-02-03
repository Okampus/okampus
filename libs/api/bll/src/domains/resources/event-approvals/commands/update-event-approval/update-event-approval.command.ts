import { UpdateEventApprovalDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class UpdateEventApprovalCommand {
  constructor(
    public readonly updateEventApproval: UpdateEventApprovalDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
