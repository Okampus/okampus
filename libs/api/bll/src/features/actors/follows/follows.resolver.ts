import { FollowsService } from './follows.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteFollowArgsType,
  DeleteByPkFollowArgsType,
  InsertOneFollowArgsType,
  InsertFollowArgsType,
  UpdateByPkFollowArgsType,
  UpdateFollowArgsType,
  FindFollowArgsType,
  FindByPkFollowArgsType,
  AggregateFollowArgsType,
} from './follows.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('FollowMutationResponse')
export class FollowsMutationResolver {
  constructor(private readonly followsService: FollowsService) {}

  @Mutation()
  async insertFollow(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertFollowArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.followsService.insertFollow(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateFollowMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateFollowArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.followsService.updateFollowMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteFollow(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteFollowArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.followsService.deleteFollow(getSelectionSet(info), where);
  }
}

@Resolver('Follow')
export class FollowsQueryResolver {
  constructor(private readonly followsService: FollowsService) {}

  @Query()
  async follow(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindFollowArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.followsService.findFollow(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertFollowOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneFollowArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.followsService.insertFollowOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async followByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkFollowArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.followsService.findFollowByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateFollowByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkFollowArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.followsService.updateFollowByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteFollowByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkFollowArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.followsService.deleteFollowByPk(getSelectionSet(info), id);
  }
}

@Resolver('FollowAggregate')
export class FollowsQueryAggregateResolver {
  constructor(private readonly followsService: FollowsService) {}

  @Query()
  async followAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateFollowArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.followsService.aggregateFollow(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}
