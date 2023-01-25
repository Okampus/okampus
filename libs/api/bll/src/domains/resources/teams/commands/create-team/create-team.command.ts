import { CreateTeamDto } from '@okampus/shared/dtos';
import { TenantCore } from '@okampus/api/dal';

export class CreateTeamCommand {
  constructor(public readonly createTeam: CreateTeamDto, public readonly tenant: TenantCore) {}
}
