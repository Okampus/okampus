// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamJoinsService } from './team-joins.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTeamJoinArgsType,
  InsertOneTeamJoinArgsType,
  InsertTeamJoinArgsType,
  UpdateByPkTeamJoinArgsType,
  UpdateTeamJoinArgsType,
  FindTeamJoinArgsType,
  FindByPkTeamJoinArgsType,
  AggregateTeamJoinArgsType,
} from './team-joins.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TeamJoinMutationResponse')
export class TeamJoinsMutationResolver {
  constructor(private readonly teamJoinsService: TeamJoinsService) {}

  @Mutation()
  async insertTeamJoin(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTeamJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamJoinsService.insertTeamJoin(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTeamJoinMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTeamJoinArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamJoinsService.updateTeamJoinMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTeamJoin(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTeamJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamJoinsService.deleteTeamJoin(getSelectionSet(info), where);
  }
}

@Resolver('TeamJoin')
export class TeamJoinsQueryResolver {
  constructor(private readonly teamJoinsService: TeamJoinsService) {}

  @Query()
  async teamJoin(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTeamJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamJoinsService.findTeamJoin(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertTeamJoinOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTeamJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamJoinsService.insertTeamJoinOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async teamJoinByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkTeamJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamJoinsService.findTeamJoinByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateTeamJoinByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTeamJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamJoinsService.updateTeamJoinByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTeamJoinByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkTeamJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamJoinsService.deleteTeamJoinByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('TeamJoinAggregate')
export class TeamJoinsQueryAggregateResolver {
  constructor(private readonly teamJoinsService: TeamJoinsService) {}

  @Query()
  async teamJoinAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTeamJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamJoinsService.aggregateTeamJoin(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
