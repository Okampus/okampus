import type { CreateTeamJoinDto } from '@okampus/shared/dtos';
import type { Individual, TenantCore } from '@okampus/api/dal';

export class CreateTeamJoinCommand {
  constructor(
    public readonly createTeamJoin: CreateTeamJoinDto,
    public readonly tenant: TenantCore,
    public readonly requester: Individual,
    public readonly populate: string[]
  ) {}
}
