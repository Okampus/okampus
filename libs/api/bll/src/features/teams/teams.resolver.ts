// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamsService } from './teams.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertTeamArgsType,
  InsertOneTeamArgsType,
  UpdateTeamArgsType,
  UpdateByPkTeamArgsType,
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
  async updateTeam(@Info() info: GraphQLResolveInfo) {
    const { where, _set } = getGraphQLArgs<UpdateTeamArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamsService.updateTeam(getSelectionSet(info), where, _set);
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
    const data = await this.teamsService.insertTeam(getSelectionSet(info), [object], onConflict, true);
    return data.returning[0];
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
