import { TransactionsService } from './transactions.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTransactionArgsType,
  DeleteByPkTransactionArgsType,
  InsertOneTransactionArgsType,
  InsertTransactionArgsType,
  UpdateByPkTransactionArgsType,
  UpdateTransactionArgsType,
  FindTransactionArgsType,
  FindByPkTransactionArgsType,
  AggregateTransactionArgsType
} from './transactions.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TransactionMutationResponse')
export class TransactionsMutationResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation()
  async insertTransaction(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTransactionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.transactionsService.insertTransaction(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTransactionMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTransactionArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.transactionsService.updateTransactionMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTransaction(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTransactionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.transactionsService.deleteTransaction(getSelectionSet(info), where);
  }
}

@Resolver('Transaction')
export class TransactionsQueryResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query()
  async transaction(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTransactionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.transactionsService.findTransaction(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertTransactionOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTransactionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.transactionsService.insertTransactionOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async transactionByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkTransactionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.transactionsService.findTransactionByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateTransactionByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTransactionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.transactionsService.updateTransactionByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTransactionByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTransactionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.transactionsService.deleteTransactionByPk(getSelectionSet(info), id);
  }
}

@Resolver('TransactionAggregate')
export class TransactionsQueryAggregateResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Query()
  async transactionAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTransactionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.transactionsService.aggregateTransaction(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
