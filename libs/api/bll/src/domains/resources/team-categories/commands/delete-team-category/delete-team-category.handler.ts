import { DeleteTeamCategoryCommand } from './delete-team-category.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteTeamCategoryCommand)
export class DeleteTeamCategoryHandler implements ICommandHandler<DeleteTeamCategoryCommand> {
  constructor(private readonly teamCategoryFactory: TeamCategoryFactory) {}

  async execute(command: DeleteTeamCategoryCommand): Promise<boolean> {
    return await this.teamCategoryFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
