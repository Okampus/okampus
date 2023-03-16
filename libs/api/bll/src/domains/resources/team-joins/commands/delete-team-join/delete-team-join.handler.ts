import { DeleteTeamJoinCommand } from './delete-team-join.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamJoinFactory } from '../../../../factories/domains/teams/team-join.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteTeamJoinCommand)
export class DeleteTeamJoinHandler implements ICommandHandler<DeleteTeamJoinCommand> {
  constructor(private readonly teamJoinFactory: TeamJoinFactory) {}

  async execute(command: DeleteTeamJoinCommand): Promise<boolean> {
    return await this.teamJoinFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
