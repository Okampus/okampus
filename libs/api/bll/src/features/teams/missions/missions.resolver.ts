import { MissionsService } from './missions.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteMissionArgsType,
  DeleteByPkMissionArgsType,
  InsertOneMissionArgsType,
  InsertMissionArgsType,
  UpdateByPkMissionArgsType,
  UpdateMissionArgsType,
  FindMissionArgsType,
  FindByPkMissionArgsType,
  AggregateMissionArgsType,
} from './missions.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('MissionMutationResponse')
export class MissionsMutationResolver {
  constructor(private readonly missionsService: MissionsService) {}

  @Mutation()
  async insertMission(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertMissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.missionsService.insertMission(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateMissionMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateMissionArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.missionsService.updateMissionMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteMission(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteMissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.missionsService.deleteMission(getSelectionSet(info), where);
  }
}

@Resolver('Mission')
export class MissionsQueryResolver {
  constructor(private readonly missionsService: MissionsService) {}

  @Query()
  async mission(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindMissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.missionsService.findMission(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertMissionOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneMissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.missionsService.insertMissionOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async missionByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkMissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.missionsService.findMissionByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateMissionByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkMissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.missionsService.updateMissionByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteMissionByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkMissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.missionsService.deleteMissionByPk(getSelectionSet(info), id);
  }
}

@Resolver('MissionAggregate')
export class MissionsQueryAggregateResolver {
  constructor(private readonly missionsService: MissionsService) {}

  @Query()
  async missionAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateMissionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.missionsService.aggregateMission(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
