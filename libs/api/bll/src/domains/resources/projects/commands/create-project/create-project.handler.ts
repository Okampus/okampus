import { CreateProjectCommand } from './create-project.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProjectFactory } from '../../../../factories/domains/teams/project.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { ProjectModel } from '../../../../factories/domains/teams/project.model';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(command: CreateProjectCommand): Promise<ProjectModel> {
    return await this.projectFactory.createProject(command.createProject, command.requester, command.tenant);
  }
}
