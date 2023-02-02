import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TeamFactory } from '../../../../factories/domains/teams/team.factory';
import { TeamModel } from '../../../../factories/domains/teams/team.model';
import { CreateTeamCommand } from './create-team.command';

@CommandHandler(CreateTeamCommand)
export class CreateTeamHandler implements ICommandHandler<CreateTeamCommand> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(command: CreateTeamCommand): Promise<TeamModel> {
    return await this.teamFactory.createTeam(
      command.createTeam,
      command.tenant,
      command.requester,
      command.actorImages
    );
  }
}
