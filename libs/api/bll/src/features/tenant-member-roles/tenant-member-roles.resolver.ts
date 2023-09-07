import { TenantMemberRolesService } from './tenant-member-roles.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTenantMemberRoleArgsType,
  DeleteByPkTenantMemberRoleArgsType,
  InsertOneTenantMemberRoleArgsType,
  InsertTenantMemberRoleArgsType,
  UpdateByPkTenantMemberRoleArgsType,
  UpdateTenantMemberRoleArgsType,
  FindTenantMemberRoleArgsType,
  FindByPkTenantMemberRoleArgsType,
  AggregateTenantMemberRoleArgsType
} from './tenant-member-roles.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TenantMemberRoleMutationResponse')
export class TenantMemberRolesMutationResolver {
  constructor(private readonly tenantMemberRolesService: TenantMemberRolesService) {}

  @Mutation()
  async insertTenantMemberRole(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTenantMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantMemberRolesService.insertTenantMemberRole(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTenantMemberRoleMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTenantMemberRoleArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantMemberRolesService.updateTenantMemberRoleMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTenantMemberRole(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTenantMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantMemberRolesService.deleteTenantMemberRole(getSelectionSet(info), where);
  }
}

@Resolver('TenantMemberRole')
export class TenantMemberRolesQueryResolver {
  constructor(private readonly tenantMemberRolesService: TenantMemberRolesService) {}

  @Query()
  async tenantMemberRole(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTenantMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantMemberRolesService.findTenantMemberRole(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertTenantMemberRoleOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTenantMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantMemberRolesService.insertTenantMemberRoleOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async tenantMemberRoleByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkTenantMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantMemberRolesService.findTenantMemberRoleByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateTenantMemberRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTenantMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantMemberRolesService.updateTenantMemberRoleByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTenantMemberRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTenantMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantMemberRolesService.deleteTenantMemberRoleByPk(getSelectionSet(info), id);
  }
}

@Resolver('TenantMemberRoleAggregate')
export class TenantMemberRolesQueryAggregateResolver {
  constructor(private readonly tenantMemberRolesService: TenantMemberRolesService) {}

  @Query()
  async tenantMemberRoleAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTenantMemberRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantMemberRolesService.aggregateTenantMemberRole(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
