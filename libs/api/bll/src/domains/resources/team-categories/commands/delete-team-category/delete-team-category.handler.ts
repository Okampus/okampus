import { DeleteTeamCategoryCommand } from './delete-team-category.command';
import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';

@CommandHandler(DeleteTeamCategoryCommand)
export class DeleteTeamCategoryHandler implements ICommandHandler<DeleteTeamCategoryCommand> {
  constructor(private readonly teamCategoryFactory: TeamCategoryFactory) {}

  async execute(command: DeleteTeamCategoryCommand): Promise<boolean> {
    return await this.teamCategoryFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
