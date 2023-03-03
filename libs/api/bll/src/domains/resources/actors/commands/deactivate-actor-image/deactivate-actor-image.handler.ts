import { DeactivateActorImageCommand as DeactivateActorImageCommand } from './deactivate-actor-image.command';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorImageFactory } from '../../../../factories/domains/images/actor-image.factory';
import { CommandHandler } from '@nestjs/cqrs';

import type { ActorImageModel } from '../../../../factories/domains/images/actor-image.model';
import type { ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(DeactivateActorImageCommand)
export class DeactivateActorImageHandler implements ICommandHandler<DeactivateActorImageCommand> {
  constructor(private readonly actorImageFactory: ActorImageFactory) {}

  async execute(command: DeactivateActorImageCommand): Promise<ActorImageModel> {
    return await this.actorImageFactory.deactivate(command.actorId, command.actorImageType, command.populate);
  }
}
