import { TenantsService } from './tenants.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTenantArgsType,
  DeleteByPkTenantArgsType,
  InsertOneTenantArgsType,
  InsertTenantArgsType,
  UpdateByPkTenantArgsType,
  UpdateTenantArgsType,
  FindTenantArgsType,
  FindByPkTenantArgsType,
  AggregateTenantArgsType
} from './tenants.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TenantMutationResponse')
export class TenantsMutationResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Mutation()
  async insertTenant(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTenantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantsService.insertTenant(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTenantMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTenantArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantsService.updateTenantMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTenant(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTenantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantsService.deleteTenant(getSelectionSet(info), where);
  }
}

@Resolver('Tenant')
export class TenantsQueryResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Query()
  async tenant(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTenantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantsService.findTenant(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertTenantOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTenantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantsService.insertTenantOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async tenantByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkTenantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantsService.findTenantByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateTenantByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTenantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantsService.updateTenantByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTenantByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTenantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantsService.deleteTenantByPk(getSelectionSet(info), id);
  }
}

@Resolver('TenantAggregate')
export class TenantsQueryAggregateResolver {
  constructor(private readonly tenantsService: TenantsService) {}

  @Query()
  async tenantAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTenantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.tenantsService.aggregateTenant(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
