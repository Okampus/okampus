import { ExpensesService } from './expenses.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteExpenseArgsType,
  DeleteByPkExpenseArgsType,
  InsertOneExpenseArgsType,
  InsertExpenseArgsType,
  UpdateByPkExpenseArgsType,
  UpdateExpenseArgsType,
  FindExpenseArgsType,
  FindByPkExpenseArgsType,
  AggregateExpenseArgsType
} from './expenses.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('ExpenseMutationResponse')
export class ExpensesMutationResolver {
  constructor(private readonly expensesService: ExpensesService) {}

  @Mutation()
  async insertExpense(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertExpenseArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.expensesService.insertExpense(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateExpenseMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateExpenseArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.expensesService.updateExpenseMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteExpense(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteExpenseArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.expensesService.deleteExpense(getSelectionSet(info), where);
  }
}

@Resolver('Expense')
export class ExpensesQueryResolver {
  constructor(private readonly expensesService: ExpensesService) {}

  @Query()
  async expense(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindExpenseArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.expensesService.findExpense(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertExpenseOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneExpenseArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.expensesService.insertExpenseOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async expenseByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkExpenseArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.expensesService.findExpenseByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateExpenseByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkExpenseArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.expensesService.updateExpenseByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteExpenseByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkExpenseArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.expensesService.deleteExpenseByPk(getSelectionSet(info), id);
  }
}

@Resolver('ExpenseAggregate')
export class ExpensesQueryAggregateResolver {
  constructor(private readonly expensesService: ExpensesService) {}

  @Query()
  async expenseAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateExpenseArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.expensesService.aggregateExpense(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
