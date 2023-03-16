import { CreateTeamJoinCommand } from './create-team-join.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamJoinFactory } from '../../../../factories/domains/teams/team-join.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { TeamJoinModel } from '../../../../factories/domains/teams/team-join.model';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateTeamJoinCommand)
export class CreateTeamJoinHandler implements ICommandHandler<CreateTeamJoinCommand> {
  constructor(private readonly teamJoinFactory: TeamJoinFactory) {}

  async execute(command: CreateTeamJoinCommand): Promise<TeamJoinModel> {
    return await this.teamJoinFactory.createTeamJoin(
      command.createTeamJoin,
      command.requester,
      command.tenant,
      command.populate
    );
  }
}
