import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TeamFactory } from '../../../../factories/teams/team.factory';
import { TeamModel } from '../../../../factories/teams/team.model';
import { UpdateTeamCommand } from './update-team.command';

@CommandHandler(UpdateTeamCommand)
export class UpdateTeamHandler implements ICommandHandler<UpdateTeamCommand> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(command: UpdateTeamCommand): Promise<TeamModel> {
    const { id, ...updateTeam } = command.updateTeam;
    return await this.teamFactory.updateActor({ id, tenant: command.tenant }, command.populate, updateTeam);
  }
}
