import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { ProjectFactory } from '../../../../factories/domains/teams/project.factory';
import type { ProjectModel } from '../../../../factories/domains/teams/project.model';
import { UpdateProjectCommand } from './update-project.command';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler implements ICommandHandler<UpdateProjectCommand> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(command: UpdateProjectCommand): Promise<ProjectModel> {
    const { id, ...updateProject } = command.updateProject;
    return await this.projectFactory.update({ id, tenant: command.tenant }, command.populate, updateProject);
  }
}
