import { CreateTeamCommand } from './create-team.command';
import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TeamFactory } from '../../../../factories/domains/teams/team.factory';
import type { TeamModel } from '../../../../factories/domains/teams/team.model';

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
