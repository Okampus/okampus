import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProjectFactory } from '../../../../factories/domains/teams/project.factory';
import { ProjectModel } from '../../../../factories/domains/teams/project.model';
import { CreateProjectCommand } from './create-project.command';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(command: CreateProjectCommand): Promise<ProjectModel> {
    return await this.projectFactory.createProject(command.createProject, command.requester, command.tenant);
  }
}
