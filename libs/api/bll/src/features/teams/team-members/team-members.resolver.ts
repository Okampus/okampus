import { TeamMembersService } from './team-members.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTeamMemberArgsType,
  DeleteByPkTeamMemberArgsType,
  InsertOneTeamMemberArgsType,
  InsertTeamMemberArgsType,
  UpdateByPkTeamMemberArgsType,
  UpdateTeamMemberArgsType,
  FindTeamMemberArgsType,
  FindByPkTeamMemberArgsType,
  AggregateTeamMemberArgsType
} from './team-members.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TeamMemberMutationResponse')
export class TeamMembersMutationResolver {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Mutation()
  async insertTeamMember(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTeamMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMembersService.insertTeamMember(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTeamMemberMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTeamMemberArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMembersService.updateTeamMemberMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTeamMember(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTeamMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMembersService.deleteTeamMember(getSelectionSet(info), where);
  }
}

@Resolver('TeamMember')
export class TeamMembersQueryResolver {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Query()
  async teamMember(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTeamMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMembersService.findTeamMember(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertTeamMemberOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTeamMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMembersService.insertTeamMemberOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async teamMemberByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkTeamMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMembersService.findTeamMemberByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateTeamMemberByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTeamMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMembersService.updateTeamMemberByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTeamMemberByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTeamMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMembersService.deleteTeamMemberByPk(getSelectionSet(info), id);
  }
}

@Resolver('TeamMemberAggregate')
export class TeamMembersQueryAggregateResolver {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Query()
  async teamMemberAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTeamMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamMembersService.aggregateTeamMember(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
