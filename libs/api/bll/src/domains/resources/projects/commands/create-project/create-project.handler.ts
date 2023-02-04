import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { ProjectFactory } from '../../../../factories/domains/teams/project.factory';
import type { ProjectModel } from '../../../../factories/domains/teams/project.model';
import { CreateProjectCommand } from './create-project.command';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(command: CreateProjectCommand): Promise<ProjectModel> {
    return await this.projectFactory.createProject(command.createProject, command.requester, command.tenant);
  }
}
