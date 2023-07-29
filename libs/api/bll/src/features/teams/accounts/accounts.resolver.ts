// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AccountsService } from './accounts.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteAccountArgsType,
  InsertOneAccountArgsType,
  InsertAccountArgsType,
  UpdateByPkAccountArgsType,
  UpdateAccountArgsType,
  FindAccountArgsType,
  FindByPkAccountArgsType,
  AggregateAccountArgsType,
} from './accounts.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('AccountMutationResponse')
export class AccountsMutationResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Mutation()
  async insertAccount(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountsService.insertAccount(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateAccountMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateAccountArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountsService.updateAccountMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteAccount(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountsService.deleteAccount(getSelectionSet(info), where);
  }
}

@Resolver('Account')
export class AccountsQueryResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Query()
  async account(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountsService.findAccount(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertAccountOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountsService.insertAccountOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async accountByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountsService.findAccountByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateAccountByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountsService.updateAccountByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteAccountByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountsService.deleteAccountByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('AccountAggregate')
export class AccountsQueryAggregateResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Query()
  async accountAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateAccountArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountsService.aggregateAccount(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
