import { TenantOrganizesService } from './tenant-organizes.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteTenantOrganizeArgsType,
  DeleteByPkTenantOrganizeArgsType,
  InsertOneTenantOrganizeArgsType,
  InsertTenantOrganizeArgsType,
  UpdateByPkTenantOrganizeArgsType,
  UpdateTenantOrganizeArgsType,
  FindTenantOrganizeArgsType,
  FindByPkTenantOrganizeArgsType,
  AggregateTenantOrganizeArgsType,
} from './tenant-organizes.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('TenantOrganizeMutationResponse')
export class TenantOrganizesMutationResolver {
  constructor(private readonly tenantOrganizesService: TenantOrganizesService) {}

  @Mutation()
  async insertTenantOrganize(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertTenantOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantOrganizesService.insertTenantOrganize(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateTenantOrganizeMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateTenantOrganizeArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantOrganizesService.updateTenantOrganizeMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteTenantOrganize(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteTenantOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantOrganizesService.deleteTenantOrganize(getSelectionSet(info), where);
  }
}

@Resolver('TenantOrganize')
export class TenantOrganizesQueryResolver {
  constructor(private readonly tenantOrganizesService: TenantOrganizesService) {}

  @Query()
  async tenantOrganize(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindTenantOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantOrganizesService.findTenantOrganize(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertTenantOrganizeOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneTenantOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantOrganizesService.insertTenantOrganizeOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async tenantOrganizeByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkTenantOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantOrganizesService.findTenantOrganizeByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateTenantOrganizeByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkTenantOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantOrganizesService.updateTenantOrganizeByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteTenantOrganizeByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkTenantOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantOrganizesService.deleteTenantOrganizeByPk(getSelectionSet(info), id);
  }
}

@Resolver('TenantOrganizeAggregate')
export class TenantOrganizesQueryAggregateResolver {
  constructor(private readonly tenantOrganizesService: TenantOrganizesService) {}

  @Query()
  async tenantOrganizeAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateTenantOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.tenantOrganizesService.aggregateTenantOrganize(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
