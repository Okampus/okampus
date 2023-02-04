import type { CreateTeamDto } from '@okampus/shared/dtos';
import type { ActorImageUploadProps, Individual, TenantCore } from '@okampus/api/dal';

export class CreateTeamCommand {
  constructor(
    public readonly createTeam: CreateTeamDto,
    public readonly requester: Individual,
    public readonly tenant: TenantCore,
    public readonly actorImages?: ActorImageUploadProps
  ) {}
}
