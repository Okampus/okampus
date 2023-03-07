import { UpdateUserCommand } from './update-user.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UserFactory } from '../../../../factories/domains/users/user.factory';

import { CommandHandler } from '@nestjs/cqrs';
import { fullName } from '@okampus/shared/utils';

import type { DeepPartial } from '@okampus/shared/types';
import type { ICommandHandler } from '@nestjs/cqrs';
import type { User } from '@okampus/api/dal';
import type { UserModel } from '../../../../factories/domains/users/user.model';

async function updateFullName(data: DeepPartial<User>, user: User): Promise<DeepPartial<User>> {
  const name = fullName(data.firstName ?? user.firstName, data.lastName ?? user.lastName);
  if (!data.actor) data.actor = {};
  data.actor.name = name;
  return data;
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(private readonly userFactory: UserFactory) {}

  async execute(command: UpdateUserCommand): Promise<UserModel> {
    const { id, ...updateUser } = command.updateUser;
    return await this.userFactory.updateActor(
      command.tenant,
      { id },
      command.populate,
      updateUser,
      updateFullName,
      command.actorImages
    );
  }
}
