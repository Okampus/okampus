import { UpdateTeamCommand } from './update-team.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamFactory } from '../../../../factories/domains/teams/team.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TeamModel } from '../../../../factories/domains/teams/team.model';

@CommandHandler(UpdateTeamCommand)
export class UpdateTeamHandler implements ICommandHandler<UpdateTeamCommand> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(command: UpdateTeamCommand): Promise<TeamModel> {
    const { id, ...updateTeam } = command.updateTeam;
    return await this.teamFactory.updateActor({ id, tenant: command.tenant }, command.populate, updateTeam);
  }
}
