import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { TeamFactory } from '../../../../factories/domains/teams/team.factory';
import type { TeamModel } from '../../../../factories/domains/teams/team.model';
import { UpdateTeamCommand } from './update-team.command';

@CommandHandler(UpdateTeamCommand)
export class UpdateTeamHandler implements ICommandHandler<UpdateTeamCommand> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(command: UpdateTeamCommand): Promise<TeamModel> {
    const { id, ...updateTeam } = command.updateTeam;
    return await this.teamFactory.updateActor({ id, tenant: command.tenant }, command.populate, updateTeam);
  }
}
