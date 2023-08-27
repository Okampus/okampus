import { FinancesService } from './finances.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteFinanceArgsType,
  DeleteByPkFinanceArgsType,
  InsertOneFinanceArgsType,
  InsertFinanceArgsType,
  UpdateByPkFinanceArgsType,
  UpdateFinanceArgsType,
  FindFinanceArgsType,
  FindByPkFinanceArgsType,
  AggregateFinanceArgsType
} from './finances.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('FinanceMutationResponse')
export class FinancesMutationResolver {
  constructor(private readonly financesService: FinancesService) {}

  @Mutation()
  async insertFinance(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.financesService.insertFinance(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateFinanceMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateFinanceArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.financesService.updateFinanceMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteFinance(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.financesService.deleteFinance(getSelectionSet(info), where);
  }
}

@Resolver('Finance')
export class FinancesQueryResolver {
  constructor(private readonly financesService: FinancesService) {}

  @Query()
  async finance(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.financesService.findFinance(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertFinanceOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.financesService.insertFinanceOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async financeByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.financesService.findFinanceByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateFinanceByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.financesService.updateFinanceByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteFinanceByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.financesService.deleteFinanceByPk(getSelectionSet(info), id);
  }
}

@Resolver('FinanceAggregate')
export class FinancesQueryAggregateResolver {
  constructor(private readonly financesService: FinancesService) {}

  @Query()
  async financeAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateFinanceArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.financesService.aggregateFinance(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
