import { DeleteTeamCommand } from './delete-team.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamFactory } from '../../../../factories/domains/teams/team.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteTeamCommand)
export class DeleteTeamHandler implements ICommandHandler<DeleteTeamCommand> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(command: DeleteTeamCommand): Promise<boolean> {
    return await this.teamFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
