import { ExpenseItemsService } from './expense-items.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteExpenseItemArgsType,
  DeleteByPkExpenseItemArgsType,
  InsertOneExpenseItemArgsType,
  InsertExpenseItemArgsType,
  UpdateByPkExpenseItemArgsType,
  UpdateExpenseItemArgsType,
  FindExpenseItemArgsType,
  FindByPkExpenseItemArgsType,
  AggregateExpenseItemArgsType,
} from './expense-items.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('ExpenseItemMutationResponse')
export class ExpenseItemsMutationResolver {
  constructor(private readonly expenseItemsService: ExpenseItemsService) {}

  @Mutation()
  async insertExpenseItem(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertExpenseItemArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.expenseItemsService.insertExpenseItem(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateExpenseItemMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateExpenseItemArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.expenseItemsService.updateExpenseItemMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteExpenseItem(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteExpenseItemArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.expenseItemsService.deleteExpenseItem(getSelectionSet(info), where);
  }
}

@Resolver('ExpenseItem')
export class ExpenseItemsQueryResolver {
  constructor(private readonly expenseItemsService: ExpenseItemsService) {}

  @Query()
  async expenseItem(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindExpenseItemArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.expenseItemsService.findExpenseItem(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertExpenseItemOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneExpenseItemArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.expenseItemsService.insertExpenseItemOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async expenseItemByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkExpenseItemArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.expenseItemsService.findExpenseItemByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateExpenseItemByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkExpenseItemArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.expenseItemsService.updateExpenseItemByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteExpenseItemByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkExpenseItemArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.expenseItemsService.deleteExpenseItemByPk(getSelectionSet(info), id);
  }
}

@Resolver('ExpenseItemAggregate')
export class ExpenseItemsQueryAggregateResolver {
  constructor(private readonly expenseItemsService: ExpenseItemsService) {}

  @Query()
  async expenseItemAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateExpenseItemArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.expenseItemsService.aggregateExpenseItem(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
