import type { UpdateEventDto } from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';

export class UpdateEventCommand {
  constructor(
    public readonly updateEvent: UpdateEventDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
