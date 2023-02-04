import type { UpdateTeamDto } from '@okampus/shared/dtos';
import type { TenantCore } from '@okampus/api/dal';

export class UpdateTeamCommand {
  constructor(
    public readonly updateTeam: UpdateTeamDto,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
