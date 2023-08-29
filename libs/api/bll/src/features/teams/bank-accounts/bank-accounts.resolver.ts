import { BankAccountsService } from './bank-accounts.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteBankAccountArgsType,
  DeleteByPkBankAccountArgsType,
  InsertOneBankAccountArgsType,
  InsertBankAccountArgsType,
  UpdateByPkBankAccountArgsType,
  UpdateBankAccountArgsType,
  FindBankAccountArgsType,
  FindByPkBankAccountArgsType,
  AggregateBankAccountArgsType
} from './bank-accounts.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('BankAccountMutationResponse')
export class BankAccountsMutationResolver {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Mutation()
  async insertBankAccount(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertBankAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankAccountsService.insertBankAccount(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateBankAccountMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateBankAccountArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankAccountsService.updateBankAccountMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteBankAccount(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteBankAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankAccountsService.deleteBankAccount(getSelectionSet(info), where);
  }
}

@Resolver('BankAccount')
export class BankAccountsQueryResolver {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Query()
  async bankAccount(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindBankAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankAccountsService.findBankAccount(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertBankAccountOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneBankAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankAccountsService.insertBankAccountOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async bankAccountByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkBankAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankAccountsService.findBankAccountByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateBankAccountByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkBankAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankAccountsService.updateBankAccountByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteBankAccountByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkBankAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankAccountsService.deleteBankAccountByPk(getSelectionSet(info), id);
  }
}

@Resolver('BankAccountAggregate')
export class BankAccountsQueryAggregateResolver {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Query()
  async bankAccountAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateBankAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankAccountsService.aggregateBankAccount(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
