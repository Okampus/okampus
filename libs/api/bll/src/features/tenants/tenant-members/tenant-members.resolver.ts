import { TenantMembersService } from './tenant-members.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTenantMemberArgsType,
  DeleteByPkTenantMemberArgsType,
  InsertOneTenantMemberArgsType,
  InsertTenantMemberArgsType,
  UpdateByPkTenantMemberArgsType,
  UpdateTenantMemberArgsType,
  FindTenantMemberArgsType,
  FindByPkTenantMemberArgsType,
  AggregateTenantMemberArgsType,
} from './tenant-members.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TenantMemberMutationResponse')
export class TenantMembersMutationResolver {
  constructor(private readonly tenantMembersService: TenantMembersService) {}

  @Mutation()
  async insertTenantMember(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTenantMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantMembersService.insertTenantMember(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTenantMemberMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTenantMemberArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantMembersService.updateTenantMemberMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTenantMember(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTenantMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantMembersService.deleteTenantMember(getSelectionSet(info), where);
  }
}

@Resolver('TenantMember')
export class TenantMembersQueryResolver {
  constructor(private readonly tenantMembersService: TenantMembersService) {}

  @Query()
  async tenantMember(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTenantMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantMembersService.findTenantMember(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertTenantMemberOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTenantMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantMembersService.insertTenantMemberOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async tenantMemberByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkTenantMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantMembersService.findTenantMemberByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateTenantMemberByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTenantMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantMembersService.updateTenantMemberByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTenantMemberByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTenantMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantMembersService.deleteTenantMemberByPk(getSelectionSet(info), id);
  }
}

@Resolver('TenantMemberAggregate')
export class TenantMembersQueryAggregateResolver {
  constructor(private readonly tenantMembersService: TenantMembersService) {}

  @Query()
  async tenantMemberAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTenantMemberArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantMembersService.aggregateTenantMember(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
