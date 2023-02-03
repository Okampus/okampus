import { UpdateProjectDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class UpdateProjectCommand {
  constructor(
    public readonly updateProject: UpdateProjectDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}