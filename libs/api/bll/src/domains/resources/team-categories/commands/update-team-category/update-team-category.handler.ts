import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TeamCategoryFactory } from '../../../../factories/domains/tags/team-category.factory';
import { TeamCategoryModel } from '../../../../factories/domains/tags/team-category.model';
import { UpdateTeamCategoryCommand } from './update-team-category.command';

@CommandHandler(UpdateTeamCategoryCommand)
export class UpdateTeamCategoryHandler implements ICommandHandler<UpdateTeamCategoryCommand> {
  constructor(private readonly teamCategoryFactory: TeamCategoryFactory) {}

  async execute(command: UpdateTeamCategoryCommand): Promise<TeamCategoryModel> {
    const { id, ...updateTeamCategory } = command.updateTeamCategory;
    return await this.teamCategoryFactory.update(id, command.populate, updateTeamCategory);
  }
}
