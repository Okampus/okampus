import { CreateTeamCategoryCommand } from './create-team-category.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { TeamCategoryModel } from '../../../../factories/domains/tags/team-category.model';

@CommandHandler(CreateTeamCategoryCommand)
export class CreateTeamCategoryHandler implements ICommandHandler<CreateTeamCategoryCommand> {
  constructor(private readonly teamCategoryFactory: TeamCategoryFactory) {}

  async execute(command: CreateTeamCategoryCommand): Promise<TeamCategoryModel> {
    return await this.teamCategoryFactory.createTeamCategory(
      command.createTeamCategory,
      command.requester,
      command.tenant,
      command.iconImage
    );
  }
}
