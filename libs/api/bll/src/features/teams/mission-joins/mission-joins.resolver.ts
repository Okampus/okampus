// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MissionJoinsService } from './mission-joins.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteMissionJoinArgsType,
  InsertOneMissionJoinArgsType,
  InsertMissionJoinArgsType,
  UpdateByPkMissionJoinArgsType,
  UpdateMissionJoinArgsType,
  FindMissionJoinArgsType,
  FindByPkMissionJoinArgsType,
  AggregateMissionJoinArgsType,
} from './mission-joins.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('MissionJoinMutationResponse')
export class MissionJoinsMutationResolver {
  constructor(private readonly missionJoinsService: MissionJoinsService) {}

  @Mutation()
  async insertMissionJoin(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertMissionJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.missionJoinsService.insertMissionJoin(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateMissionJoinMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateMissionJoinArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.missionJoinsService.updateMissionJoinMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteMissionJoin(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteMissionJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.missionJoinsService.deleteMissionJoin(getSelectionSet(info), where);
  }
}

@Resolver('MissionJoin')
export class MissionJoinsQueryResolver {
  constructor(private readonly missionJoinsService: MissionJoinsService) {}

  @Query()
  async missionJoin(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindMissionJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.missionJoinsService.findMissionJoin(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }

  @Mutation()
  async insertMissionJoinOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneMissionJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.missionJoinsService.insertMissionJoinOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async missionJoinByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkMissionJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.missionJoinsService.findMissionJoinByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateMissionJoinByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkMissionJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.missionJoinsService.updateMissionJoinByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteMissionJoinByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkMissionJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.missionJoinsService.deleteMissionJoinByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('MissionJoinAggregate')
export class MissionJoinsQueryAggregateResolver {
  constructor(private readonly missionJoinsService: MissionJoinsService) {}

  @Query()
  async missionJoinAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateMissionJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.missionJoinsService.aggregateMissionJoin(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
