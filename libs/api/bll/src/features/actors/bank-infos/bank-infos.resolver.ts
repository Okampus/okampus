import { BankInfosService } from './bank-infos.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteBankInfoArgsType,
  InsertOneBankInfoArgsType,
  InsertBankInfoArgsType,
  UpdateByPkBankInfoArgsType,
  UpdateBankInfoArgsType,
  FindBankInfoArgsType,
  FindByPkBankInfoArgsType,
  AggregateBankInfoArgsType,
} from './bank-infos.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('BankInfoMutationResponse')
export class BankInfosMutationResolver {
  constructor(private readonly bankInfosService: BankInfosService) {}

  @Mutation()
  async insertBankInfo(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertBankInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankInfosService.insertBankInfo(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateBankInfoMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateBankInfoArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankInfosService.updateBankInfoMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteBankInfo(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteBankInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankInfosService.deleteBankInfo(getSelectionSet(info), where);
  }
}

@Resolver('BankInfo')
export class BankInfosQueryResolver {
  constructor(private readonly bankInfosService: BankInfosService) {}

  @Query()
  async bankInfo(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindBankInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankInfosService.findBankInfo(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertBankInfoOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneBankInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankInfosService.insertBankInfoOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async bankInfoByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkBankInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankInfosService.findBankInfoByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateBankInfoByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkBankInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankInfosService.updateBankInfoByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteBankInfoByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkBankInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankInfosService.deleteBankInfoByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('BankInfoAggregate')
export class BankInfosQueryAggregateResolver {
  constructor(private readonly bankInfosService: BankInfosService) {}

  @Query()
  async bankInfoAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateBankInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.bankInfosService.aggregateBankInfo(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
