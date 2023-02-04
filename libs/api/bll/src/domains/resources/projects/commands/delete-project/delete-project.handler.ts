import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { ProjectFactory } from '../../../../factories/domains/teams/project.factory';
import { DeleteProjectCommand } from './delete-project.command';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(command: DeleteProjectCommand): Promise<boolean> {
    return await this.projectFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
