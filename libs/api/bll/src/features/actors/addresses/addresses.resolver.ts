import { AddressesService } from './addresses.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteAddressArgsType,
  DeleteByPkAddressArgsType,
  InsertOneAddressArgsType,
  InsertAddressArgsType,
  UpdateByPkAddressArgsType,
  UpdateAddressArgsType,
  FindAddressArgsType,
  FindByPkAddressArgsType,
  AggregateAddressArgsType
} from './addresses.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('AddressMutationResponse')
export class AddressesMutationResolver {
  constructor(private readonly addressesService: AddressesService) {}

  @Mutation()
  async insertAddress(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertAddressArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.addressesService.insertAddress(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateAddressMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateAddressArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.addressesService.updateAddressMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteAddress(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteAddressArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.addressesService.deleteAddress(getSelectionSet(info), where);
  }
}

@Resolver('Address')
export class AddressesQueryResolver {
  constructor(private readonly addressesService: AddressesService) {}

  @Query()
  async address(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindAddressArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.addressesService.findAddress(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertAddressOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneAddressArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.addressesService.insertAddressOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async addressByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkAddressArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.addressesService.findAddressByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateAddressByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkAddressArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.addressesService.updateAddressByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteAddressByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkAddressArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.addressesService.deleteAddressByPk(getSelectionSet(info), id);
  }
}

@Resolver('AddressAggregate')
export class AddressesQueryAggregateResolver {
  constructor(private readonly addressesService: AddressesService) {}

  @Query()
  async addressAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateAddressArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.addressesService.aggregateAddress(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
