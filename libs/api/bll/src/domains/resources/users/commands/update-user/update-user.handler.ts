import { UpdateUserCommand } from './update-user.command';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserFactory } from '../../../../factories/domains/users/user.factory';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { UserModel } from '../../../../factories/domains/users/user.model';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(command: UpdateUserCommand): Promise<UserModel> {
    return await this.userFactory.updateUser(command.updateUser, command.tenant, command.populate, command.actorImages);
  }
}
