// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamFinancesService } from './team-finances.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertOneTeamFinanceArgsType,
  InsertTeamFinanceArgsType,
  UpdateByPkTeamFinanceArgsType,
  UpdateTeamFinanceArgsType,
  FindTeamFinanceArgsType,
  FindByPkTeamFinanceArgsType,
  AggregateTeamFinanceArgsType,
} from './team-finances.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TeamFinanceMutationResponse')
export class TeamFinancesMutationResolver {
  constructor(private readonly teamFinancesService: TeamFinancesService) {}

  @Mutation()
  async insertTeamFinance(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTeamFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamFinancesService.insertTeamFinance(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTeamFinanceMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTeamFinanceArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamFinancesService.updateTeamFinanceMany(getSelectionSet(info), updates);
  }
}

@Resolver('TeamFinance')
export class TeamFinancesQueryResolver {
  constructor(private readonly teamFinancesService: TeamFinancesService) {}

  @Query()
  async teamFinance(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTeamFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamFinancesService.findTeamFinance(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }

  @Mutation()
  async insertTeamFinanceOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTeamFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    const data = await this.teamFinancesService.insertTeamFinanceOne(getSelectionSet(info), object, onConflict);
    return data.returning[0];
  }

  @Query()
  async teamFinanceByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkTeamFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamFinancesService.findTeamFinanceByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateTeamFinanceByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTeamFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamFinancesService.updateTeamFinanceByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTeamFinanceByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkTeamFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamFinancesService.deleteTeamFinanceByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('TeamFinanceAggregate')
export class TeamFinancesQueryAggregateResolver {
  constructor(private readonly teamFinancesService: TeamFinancesService) {}

  @Query()
  async teamFinanceAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTeamFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.teamFinancesService.aggregateTeamFinance(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
