import { TeamRolesService } from './team-roles.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTeamRoleArgsType,
  DeleteByPkTeamRoleArgsType,
  InsertOneTeamRoleArgsType,
  InsertTeamRoleArgsType,
  UpdateByPkTeamRoleArgsType,
  UpdateTeamRoleArgsType,
  FindTeamRoleArgsType,
  FindByPkTeamRoleArgsType,
  AggregateTeamRoleArgsType
} from './team-roles.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TeamRoleMutationResponse')
export class TeamRolesMutationResolver {
  constructor(private readonly teamRolesService: TeamRolesService) {}

  @Mutation()
  async insertTeamRole(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTeamRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamRolesService.insertTeamRole(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTeamRoleMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTeamRoleArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamRolesService.updateTeamRoleMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTeamRole(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTeamRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamRolesService.deleteTeamRole(getSelectionSet(info), where);
  }
}

@Resolver('TeamRole')
export class TeamRolesQueryResolver {
  constructor(private readonly teamRolesService: TeamRolesService) {}

  @Query()
  async teamRole(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTeamRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamRolesService.findTeamRole(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertTeamRoleOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTeamRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamRolesService.insertTeamRoleOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async teamRoleByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkTeamRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamRolesService.findTeamRoleByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateTeamRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTeamRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamRolesService.updateTeamRoleByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTeamRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTeamRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamRolesService.deleteTeamRoleByPk(getSelectionSet(info), id);
  }
}

@Resolver('TeamRoleAggregate')
export class TeamRolesQueryAggregateResolver {
  constructor(private readonly teamRolesService: TeamRolesService) {}

  @Query()
  async teamRoleAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTeamRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamRolesService.aggregateTeamRole(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
