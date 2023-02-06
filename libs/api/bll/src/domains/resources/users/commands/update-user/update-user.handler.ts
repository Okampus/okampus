import { UpdateUserCommand } from './update-user.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserFactory } from '../../../../factories/domains/users/user.factory';

import { CommandHandler } from '@nestjs/cqrs';
import { fullName } from '@okampus/shared/utils';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { User } from '@okampus/api/dal';
import type { UserModel } from '../../../../factories/domains/users/user.model';

async function updateFullName(data: Partial<User>, user: User) {
  const name = fullName(data.firstName ?? user.firstName, data.lastName ?? user.lastName);
  return { ...data, actor: { ...data.actor, name } } as Partial<User>;
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(command: UpdateUserCommand): Promise<UserModel> {
    const { id, ...updateUser } = command.updateUser;
    const where = { id, tenant: command.tenant };
    return await this.userFactory.updateActor(where, command.populate, updateUser, updateFullName);
  }
}
