import type { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import type { User } from '@okampus/api/dal';
import { fullName } from '@okampus/shared/utils';
import type { UserFactory } from '../../../../factories/domains/users/user.factory';
import type { UserModel } from '../../../../factories/domains/users/user.model';
import { UpdateUserCommand } from './update-user.command';

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
