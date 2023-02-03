import { Individual } from '@okampus/api/dal';
import { CreateEventDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class CreateEventCommand {
  constructor(
    public readonly createEvent: CreateEventDto,
    public readonly forTenant: TenantCore,
    public readonly forIndividual: Individual
  ) {}
}
