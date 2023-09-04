import { TeamMemberRolesService } from './team-member-roles.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTeamMemberRoleArgsType,
  DeleteByPkTeamMemberRoleArgsType,
  InsertOneTeamMemberRoleArgsType,
  InsertTeamMemberRoleArgsType,
  UpdateByPkTeamMemberRoleArgsType,
  UpdateTeamMemberRoleArgsType,
  FindTeamMemberRoleArgsType,
  FindByPkTeamMemberRoleArgsType,
  AggregateTeamMemberRoleArgsType
} from './team-member-roles.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TeamMemberRoleMutationResponse')
export class TeamMemberRolesMutationResolver {
  constructor(private readonly teamMemberRolesService: TeamMemberRolesService) {}

  @Mutation()
  async insertTeamMemberRole(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTeamMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMemberRolesService.insertTeamMemberRole(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTeamMemberRoleMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTeamMemberRoleArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMemberRolesService.updateTeamMemberRoleMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTeamMemberRole(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTeamMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMemberRolesService.deleteTeamMemberRole(getSelectionSet(info), where);
  }
}

@Resolver('TeamMemberRole')
export class TeamMemberRolesQueryResolver {
  constructor(private readonly teamMemberRolesService: TeamMemberRolesService) {}

  @Query()
  async teamMemberRole(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTeamMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMemberRolesService.findTeamMemberRole(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertTeamMemberRoleOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTeamMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMemberRolesService.insertTeamMemberRoleOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async teamMemberRoleByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkTeamMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMemberRolesService.findTeamMemberRoleByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateTeamMemberRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTeamMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMemberRolesService.updateTeamMemberRoleByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTeamMemberRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTeamMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMemberRolesService.deleteTeamMemberRoleByPk(getSelectionSet(info), id);
  }
}

@Resolver('TeamMemberRoleAggregate')
export class TeamMemberRolesQueryAggregateResolver {
  constructor(private readonly teamMemberRolesService: TeamMemberRolesService) {}

  @Query()
  async teamMemberRoleAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTeamMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMemberRolesService.aggregateTeamMemberRole(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
