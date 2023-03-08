import { DeactivateUserImageCommand } from './deactivate-user-image.command';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorImageFactory } from '../../../../factories/domains/images/actor-image.factory';

import { CommandHandler } from '@nestjs/cqrs';
import { ForbiddenException } from '@nestjs/common';
import { IndividualKind } from '@okampus/shared/enums';

import type { ActorImageModel } from '../../../../factories/domains/images/actor-image.model';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeactivateUserImageCommand)
export class DeactivateUserImageHandler implements ICommandHandler<DeactivateUserImageCommand> {
  constructor(private readonly actorImageFactory: ActorImageFactory) {}

  async execute(command: DeactivateUserImageCommand): Promise<ActorImageModel> {
    if (command.id !== command.requester.id) throw new ForbiddenException('You are not allowed to edit this user');

    return await this.actorImageFactory.deactivate(
      { individual: { id: command.id, individualKind: IndividualKind.User } },
      command.actorImageType,
      command.tenant,
      command.populate,
      true
    );
  }
}
