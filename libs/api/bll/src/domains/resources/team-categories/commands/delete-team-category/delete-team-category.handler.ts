import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';
import { DeleteTeamCategoryCommand } from './delete-team-category.command';

@CommandHandler(DeleteTeamCategoryCommand)
export class DeleteTeamCategoryHandler implements ICommandHandler<DeleteTeamCategoryCommand> {
  constructor(private readonly teamCategoryFactory: TeamCategoryFactory) {}

  async execute(command: DeleteTeamCategoryCommand): Promise<boolean> {
    return await this.teamCategoryFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
