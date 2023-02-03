import { CreateProjectDto } from '@okampus/shared/dtos';
import { Individual, TenantCore } from '@okampus/api/dal';

export class CreateProjectCommand {
  constructor(
    public readonly createProject: CreateProjectDto,
    public readonly requester: Individual,
    public readonly tenant: TenantCore
  ) {}
}
