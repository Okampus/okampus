import { DeleteUserCommand } from './delete-user.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserFactory } from '../../../../factories/domains/users/user.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(command: DeleteUserCommand): Promise<boolean> {
    return await this.userFactory.delete({ id: command.id, tenant: command.tenant });
  }
}
