import { UpdateTeamJoinCommand } from './update-team-join.command';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamJoinFactory } from '../../../../factories/domains/teams/team-join.factory';
import { CommandHandler } from '@nestjs/cqrs';

import type { TeamJoinModel } from '../../../../factories/domains/teams/team-join.model';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateTeamJoinCommand)
export class UpdateTeamJoinHandler implements ICommandHandler<UpdateTeamJoinCommand> {
  constructor(private readonly teamJoinFactory: TeamJoinFactory) {}

  async execute(command: UpdateTeamJoinCommand): Promise<TeamJoinModel> {
    return await this.teamJoinFactory.updateTeamJoin(
      command.updateTeamJoin,
      command.requester,
      command.tenant,
      command.populate
    );
  }
}
