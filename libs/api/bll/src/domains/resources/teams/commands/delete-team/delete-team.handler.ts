import { DeleteTeamCommand } from './delete-team.command';
import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TeamFactory } from '../../../../factories/domains/teams/team.factory';

@CommandHandler(DeleteTeamCommand)
export class DeleteTeamHandler implements ICommandHandler<DeleteTeamCommand> {
  constructor(private readonly teamFactory: TeamFactory) {}

  async execute(command: DeleteTeamCommand): Promise<boolean> {
    return await this.teamFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
