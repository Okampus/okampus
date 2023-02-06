import type { CreateProjectDto } from '@okampus/shared/dtos';
import type { Individual, TenantCore } from '@okampus/api/dal';

export class CreateProjectCommand {
  constructor(
    public readonly createProject: CreateProjectDto,
    public readonly requester: Individual,
    public readonly tenant: TenantCore
  ) {}
}
