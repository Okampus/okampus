import { UpdateTeamDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class UpdateTeamCommand {
  constructor(
    public readonly updateTeam: UpdateTeamDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
