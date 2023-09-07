import { TeamHistoriesService } from './team-histories.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTeamHistoryArgsType,
  DeleteByPkTeamHistoryArgsType,
  InsertOneTeamHistoryArgsType,
  InsertTeamHistoryArgsType,
  UpdateByPkTeamHistoryArgsType,
  UpdateTeamHistoryArgsType,
  FindTeamHistoryArgsType,
  FindByPkTeamHistoryArgsType,
  AggregateTeamHistoryArgsType
} from './team-histories.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TeamHistoryMutationResponse')
export class TeamHistoriesMutationResolver {
  constructor(private readonly teamHistoriesService: TeamHistoriesService) {}

  @Mutation()
  async insertTeamHistory(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTeamHistoryArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamHistoriesService.insertTeamHistory(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTeamHistoryMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTeamHistoryArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamHistoriesService.updateTeamHistoryMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTeamHistory(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTeamHistoryArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamHistoriesService.deleteTeamHistory(getSelectionSet(info), where);
  }
}

@Resolver('TeamHistory')
export class TeamHistoriesQueryResolver {
  constructor(private readonly teamHistoriesService: TeamHistoriesService) {}

  @Query()
  async teamHistory(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTeamHistoryArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamHistoriesService.findTeamHistory(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertTeamHistoryOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTeamHistoryArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamHistoriesService.insertTeamHistoryOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async teamHistoryByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkTeamHistoryArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamHistoriesService.findTeamHistoryByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateTeamHistoryByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTeamHistoryArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamHistoriesService.updateTeamHistoryByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTeamHistoryByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTeamHistoryArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamHistoriesService.deleteTeamHistoryByPk(getSelectionSet(info), id);
  }
}

@Resolver('TeamHistoryAggregate')
export class TeamHistoriesQueryAggregateResolver {
  constructor(private readonly teamHistoriesService: TeamHistoriesService) {}

  @Query()
  async teamHistoryAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTeamHistoryArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamHistoriesService.aggregateTeamHistory(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
