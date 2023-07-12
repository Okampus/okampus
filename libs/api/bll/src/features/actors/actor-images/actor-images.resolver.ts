// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorImagesService } from './actor-images.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteActorImageArgsType,
  InsertOneActorImageArgsType,
  InsertActorImageArgsType,
  UpdateByPkActorImageArgsType,
  UpdateActorImageArgsType,
  FindActorImageArgsType,
  FindByPkActorImageArgsType,
  AggregateActorImageArgsType,
} from './actor-images.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('ActorImageMutationResponse')
export class ActorImagesMutationResolver {
  constructor(private readonly actorImagesService: ActorImagesService) {}

  @Mutation()
  async insertActorImage(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertActorImageArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorImagesService.insertActorImage(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateActorImageMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateActorImageArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorImagesService.updateActorImageMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteActorImage(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteActorImageArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorImagesService.deleteActorImage(getSelectionSet(info), where);
  }
}

@Resolver('ActorImage')
export class ActorImagesQueryResolver {
  constructor(private readonly actorImagesService: ActorImagesService) {}

  @Query()
  async actorImage(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindActorImageArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorImagesService.findActorImage(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }

  @Mutation()
  async insertActorImageOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneActorImageArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorImagesService.insertActorImageOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async actorImageByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkActorImageArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorImagesService.findActorImageByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateActorImageByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkActorImageArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorImagesService.updateActorImageByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteActorImageByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkActorImageArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorImagesService.deleteActorImageByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('ActorImageAggregate')
export class ActorImagesQueryAggregateResolver {
  constructor(private readonly actorImagesService: ActorImagesService) {}

  @Query()
  async actorImageAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateActorImageArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorImagesService.aggregateActorImage(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
