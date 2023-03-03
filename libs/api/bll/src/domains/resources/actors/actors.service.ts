import { DeactivateActorImageCommand } from './commands/deactivate-actor-image/deactivate-actor-image.command';
import { RequestContext } from '../../../shards/abstract/request-context';
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { Snowflake } from '@okampus/shared/types';
import type { ActorImageType } from '@okampus/shared/enums';

@Injectable()
export class ActorsService extends RequestContext {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {
    super();
  }

  deactivateActorImage(actorId: Snowflake, actorImageType: ActorImageType) {
    const command = new DeactivateActorImageCommand(actorId, actorImageType, this.autoGqlPopulate());
    return this.commandBus.execute(command);
  }
}
