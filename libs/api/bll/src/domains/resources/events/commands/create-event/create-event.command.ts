import type { Individual } from '@okampus/api/dal';
import type { CreateEventDto } from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';

export class CreateEventCommand {
  constructor(
    public readonly createEvent: CreateEventDto,
    public readonly tenant: TenantCore,
    public readonly requester: Individual
  ) {}
}
