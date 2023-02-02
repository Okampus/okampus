import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';
import { TeamCategoryModel } from '../../../../factories/domains/tags/team-category.model';
import { CreateTeamCategoryCommand } from './create-team-category.command';

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
