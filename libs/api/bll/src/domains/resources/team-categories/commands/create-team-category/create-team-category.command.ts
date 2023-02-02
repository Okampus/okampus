import { CreateTeamCategoryDto } from '@okampus/shared/dtos';
import { Individual, TenantCore } from '@okampus/api/dal';
import { MulterFileType } from '@okampus/shared/types';

export class CreateTeamCategoryCommand {
  constructor(
    public readonly createTeamCategory: CreateTeamCategoryDto,
    public readonly tenant: TenantCore,
    public readonly requester: Individual,
    public readonly iconImage?: MulterFileType
  ) {}
}
