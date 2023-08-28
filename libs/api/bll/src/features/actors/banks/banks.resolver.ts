import { BanksService } from './banks.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteBankArgsType,
  DeleteByPkBankArgsType,
  InsertOneBankArgsType,
  InsertBankArgsType,
  UpdateByPkBankArgsType,
  UpdateBankArgsType,
  FindBankArgsType,
  FindByPkBankArgsType,
  AggregateBankArgsType
} from './banks.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('BankMutationResponse')
export class BanksMutationResolver {
  constructor(private readonly banksService: BanksService) {}

  @Mutation()
  async insertBank(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertBankArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.banksService.insertBank(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateBankMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateBankArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.banksService.updateBankMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteBank(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteBankArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.banksService.deleteBank(getSelectionSet(info), where);
  }
}

@Resolver('Bank')
export class BanksQueryResolver {
  constructor(private readonly banksService: BanksService) {}

  @Query()
  async bank(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindBankArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.banksService.findBank(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertBankOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneBankArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.banksService.insertBankOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async bankByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkBankArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.banksService.findBankByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateBankByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkBankArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.banksService.updateBankByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteBankByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkBankArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.banksService.deleteBankByPk(getSelectionSet(info), id);
  }
}

@Resolver('BankAggregate')
export class BanksQueryAggregateResolver {
  constructor(private readonly banksService: BanksService) {}

  @Query()
  async bankAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateBankArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.banksService.aggregateBank(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
