import { ActorTagsService } from './actor-tags.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteActorTagArgsType,
  DeleteByPkActorTagArgsType,
  InsertOneActorTagArgsType,
  InsertActorTagArgsType,
  UpdateByPkActorTagArgsType,
  UpdateActorTagArgsType,
  FindActorTagArgsType,
  FindByPkActorTagArgsType,
  AggregateActorTagArgsType,
} from './actor-tags.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('ActorTagMutationResponse')
export class ActorTagsMutationResolver {
  constructor(private readonly actorTagsService: ActorTagsService) {}

  @Mutation()
  async insertActorTag(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertActorTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.actorTagsService.insertActorTag(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateActorTagMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateActorTagArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.actorTagsService.updateActorTagMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteActorTag(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteActorTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.actorTagsService.deleteActorTag(getSelectionSet(info), where);
  }
}

@Resolver('ActorTag')
export class ActorTagsQueryResolver {
  constructor(private readonly actorTagsService: ActorTagsService) {}

  @Query()
  async actorTag(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindActorTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.actorTagsService.findActorTag(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertActorTagOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneActorTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.actorTagsService.insertActorTagOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async actorTagByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkActorTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.actorTagsService.findActorTagByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateActorTagByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkActorTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.actorTagsService.updateActorTagByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteActorTagByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkActorTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.actorTagsService.deleteActorTagByPk(getSelectionSet(info), id);
  }
}

@Resolver('ActorTagAggregate')
export class ActorTagsQueryAggregateResolver {
  constructor(private readonly actorTagsService: ActorTagsService) {}

  @Query()
  async actorTagAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateActorTagArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.actorTagsService.aggregateActorTag(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
