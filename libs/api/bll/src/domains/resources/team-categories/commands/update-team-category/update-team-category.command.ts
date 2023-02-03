import { UpdateTeamCategoryDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class UpdateTeamCategoryCommand {
  constructor(
    public readonly updateTeamCategory: UpdateTeamCategoryDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
