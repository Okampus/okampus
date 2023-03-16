import type { ActorImageUploadProps, Individual, TenantCore } from '@okampus/api/dal';
import type { UpdateTeamDto } from '@okampus/shared/dtos';

export class UpdateTeamCommand {
  constructor(
    public readonly updateTeam: UpdateTeamDto,
    public readonly requester: Individual,
    public readonly tenant: TenantCore,
    public readonly populate: never[],
    public readonly actorImages?: ActorImageUploadProps
  ) {}
}
