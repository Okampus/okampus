import { DeleteProjectCommand } from './delete-project.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProjectFactory } from '../../../../factories/domains/teams/project.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(private readonly projectFactory: ProjectFactory) {}

  async execute(command: DeleteProjectCommand): Promise<boolean> {
    return await this.projectFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
