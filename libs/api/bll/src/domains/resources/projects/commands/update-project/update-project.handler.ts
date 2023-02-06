import { UpdateProjectCommand } from './update-project.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProjectFactory } from '../../../../factories/domains/teams/project.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { ProjectModel } from '../../../../factories/domains/teams/project.model';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler implements ICommandHandler<UpdateProjectCommand> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(command: UpdateProjectCommand): Promise<ProjectModel> {
    const { id, ...updateProject } = command.updateProject;
    return await this.projectFactory.update({ id, tenant: command.tenant }, command.populate, updateProject);
  }
}
