// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorsService } from './actors.service';
import { ActorModel, ActorImageModel } from '../../factories';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { ActorImageType } from '@okampus/shared/enums';

import type { Snowflake } from '@okampus/shared/types';

@Resolver(() => ActorModel)
export class ActorsResolver {
  constructor(private readonly actorsService: ActorsService) {}

  @Mutation(() => ActorImageModel)
  deactivateActorImage(
    @Args('actorId', { type: () => String }) id: Snowflake,
    @Args('actorImageType', { type: () => ActorImageType }) actorImageType: ActorImageType
  ) {
    return this.actorsService.deactivateActorImage(id, actorImageType);
  }
}
