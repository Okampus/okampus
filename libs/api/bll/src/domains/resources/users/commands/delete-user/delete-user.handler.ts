import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserFactory } from '../../../../factories/domains/users/user.factory';
import { DeleteUserCommand } from './delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(command: DeleteUserCommand): Promise<boolean> {
    return await this.userFactory.delete({ id: command.id, tenant: command.tenant });
  }
}