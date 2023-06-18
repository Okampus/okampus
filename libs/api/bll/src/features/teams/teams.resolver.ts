// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamsService } from './teams.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTeamArgsType,
  InsertOneTeamArgsType,
  InsertTeamArgsType,
  UpdateByPkTeamArgsType,
  UpdateTeamArgsType,
  FindTeamArgsType,
  FindByPkTeamArgsType,
  AggregateTeamArgsType,
} from './teams.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TeamMutationResponse')
export class TeamsMutationResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Mutation()
  async insertTeam(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTeamArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamsService.insertTeam(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTeamMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTeamArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamsService.updateTeamMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTeam(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTeamArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamsService.deleteTeam(getSelectionSet(info), where);
  }
}

@Resolver('Team')
export class TeamsQueryResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Query()
  async team(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTeamArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamsService.findTeam(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertTeamOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTeamArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamsService.insertTeamOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async teamByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkTeamArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamsService.findTeamByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateTeamByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTeamArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamsService.updateTeamByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTeamByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkTeamArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamsService.deleteTeamByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('TeamAggregate')
export class TeamsQueryAggregateResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Query()
  async teamAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTeamArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamsService.aggregateTeam(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}
