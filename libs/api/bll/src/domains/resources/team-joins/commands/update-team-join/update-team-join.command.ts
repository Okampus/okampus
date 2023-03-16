import type { UpdateTeamJoinDto } from '@okampus/shared/dtos';
import type { Individual, TenantCore } from '@okampus/api/dal';

export class UpdateTeamJoinCommand {
  constructor(
    public readonly updateTeamJoin: UpdateTeamJoinDto,
    public readonly requester: Individual,
    public readonly tenant: TenantCore,
    public readonly populate: never[]
  ) {}
}
