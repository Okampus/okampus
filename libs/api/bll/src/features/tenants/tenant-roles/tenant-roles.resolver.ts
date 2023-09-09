import { TenantRolesService } from './tenant-roles.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTenantRoleArgsType,
  DeleteByPkTenantRoleArgsType,
  InsertOneTenantRoleArgsType,
  InsertTenantRoleArgsType,
  UpdateByPkTenantRoleArgsType,
  UpdateTenantRoleArgsType,
  FindTenantRoleArgsType,
  FindByPkTenantRoleArgsType,
  AggregateTenantRoleArgsType,
} from './tenant-roles.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TenantRoleMutationResponse')
export class TenantRolesMutationResolver {
  constructor(private readonly tenantRolesService: TenantRolesService) {}

  @Mutation()
  async insertTenantRole(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTenantRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantRolesService.insertTenantRole(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTenantRoleMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTenantRoleArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantRolesService.updateTenantRoleMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTenantRole(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTenantRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantRolesService.deleteTenantRole(getSelectionSet(info), where);
  }
}

@Resolver('TenantRole')
export class TenantRolesQueryResolver {
  constructor(private readonly tenantRolesService: TenantRolesService) {}

  @Query()
  async tenantRole(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTenantRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantRolesService.findTenantRole(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertTenantRoleOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTenantRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantRolesService.insertTenantRoleOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async tenantRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkTenantRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantRolesService.findTenantRoleByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateTenantRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTenantRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantRolesService.updateTenantRoleByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTenantRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTenantRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantRolesService.deleteTenantRoleByPk(getSelectionSet(info), id);
  }
}

@Resolver('TenantRoleAggregate')
export class TenantRolesQueryAggregateResolver {
  constructor(private readonly tenantRolesService: TenantRolesService) {}

  @Query()
  async tenantRoleAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTenantRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantRolesService.aggregateTenantRole(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
