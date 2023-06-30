// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AccountAllocatesService } from './account-allocates.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteAccountAllocateArgsType,
  InsertOneAccountAllocateArgsType,
  InsertAccountAllocateArgsType,
  UpdateByPkAccountAllocateArgsType,
  UpdateAccountAllocateArgsType,
  FindAccountAllocateArgsType,
  FindByPkAccountAllocateArgsType,
  AggregateAccountAllocateArgsType,
} from './account-allocates.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('AccountAllocateMutationResponse')
export class AccountAllocatesMutationResolver {
  constructor(private readonly accountAllocatesService: AccountAllocatesService) {}

  @Mutation()
  async insertAccountAllocate(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertAccountAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountAllocatesService.insertAccountAllocate(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateAccountAllocateMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateAccountAllocateArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountAllocatesService.updateAccountAllocateMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteAccountAllocate(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteAccountAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountAllocatesService.deleteAccountAllocate(getSelectionSet(info), where);
  }
}

@Resolver('AccountAllocate')
export class AccountAllocatesQueryResolver {
  constructor(private readonly accountAllocatesService: AccountAllocatesService) {}

  @Query()
  async accountAllocate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindAccountAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountAllocatesService.findAccountAllocate(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }

  @Mutation()
  async insertAccountAllocateOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneAccountAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountAllocatesService.insertAccountAllocateOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async accountAllocateByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkAccountAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountAllocatesService.findAccountAllocateByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateAccountAllocateByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkAccountAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountAllocatesService.updateAccountAllocateByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteAccountAllocateByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkAccountAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountAllocatesService.deleteAccountAllocateByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('AccountAllocateAggregate')
export class AccountAllocatesQueryAggregateResolver {
  constructor(private readonly accountAllocatesService: AccountAllocatesService) {}

  @Query()
  async accountAllocateAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateAccountAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.accountAllocatesService.aggregateAccountAllocate(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
