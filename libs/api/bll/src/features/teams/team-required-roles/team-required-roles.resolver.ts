import { TeamRequiredRolesService } from './team-required-roles.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTeamRequiredRoleArgsType,
  DeleteByPkTeamRequiredRoleArgsType,
  InsertOneTeamRequiredRoleArgsType,
  InsertTeamRequiredRoleArgsType,
  UpdateByPkTeamRequiredRoleArgsType,
  UpdateTeamRequiredRoleArgsType,
  FindTeamRequiredRoleArgsType,
  FindByPkTeamRequiredRoleArgsType,
  AggregateTeamRequiredRoleArgsType,
} from './team-required-roles.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TeamRequiredRoleMutationResponse')
export class TeamRequiredRolesMutationResolver {
  constructor(private readonly teamRequiredRolesService: TeamRequiredRolesService) {}

  @Mutation()
  async insertTeamRequiredRole(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTeamRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.teamRequiredRolesService.insertTeamRequiredRole(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTeamRequiredRoleMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTeamRequiredRoleArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.teamRequiredRolesService.updateTeamRequiredRoleMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTeamRequiredRole(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTeamRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.teamRequiredRolesService.deleteTeamRequiredRole(getSelectionSet(info), where);
  }
}

@Resolver('TeamRequiredRole')
export class TeamRequiredRolesQueryResolver {
  constructor(private readonly teamRequiredRolesService: TeamRequiredRolesService) {}

  @Query()
  async teamRequiredRole(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTeamRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.teamRequiredRolesService.findTeamRequiredRole(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertTeamRequiredRoleOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTeamRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.teamRequiredRolesService.insertTeamRequiredRoleOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async teamRequiredRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkTeamRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.teamRequiredRolesService.findTeamRequiredRoleByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateTeamRequiredRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTeamRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.teamRequiredRolesService.updateTeamRequiredRoleByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTeamRequiredRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTeamRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.teamRequiredRolesService.deleteTeamRequiredRoleByPk(getSelectionSet(info), id);
  }
}

@Resolver('TeamRequiredRoleAggregate')
export class TeamRequiredRolesQueryAggregateResolver {
  constructor(private readonly teamRequiredRolesService: TeamRequiredRolesService) {}

  @Query()
  async teamRequiredRoleAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTeamRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.teamRequiredRolesService.aggregateTeamRequiredRole(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
