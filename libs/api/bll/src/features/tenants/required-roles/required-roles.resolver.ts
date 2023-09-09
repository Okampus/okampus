import { RequiredRolesService } from './required-roles.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteRequiredRoleArgsType,
  DeleteByPkRequiredRoleArgsType,
  InsertOneRequiredRoleArgsType,
  InsertRequiredRoleArgsType,
  UpdateByPkRequiredRoleArgsType,
  UpdateRequiredRoleArgsType,
  FindRequiredRoleArgsType,
  FindByPkRequiredRoleArgsType,
  AggregateRequiredRoleArgsType,
} from './required-roles.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('RequiredRoleMutationResponse')
export class RequiredRolesMutationResolver {
  constructor(private readonly requiredRolesService: RequiredRolesService) {}

  @Mutation()
  async insertRequiredRole(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredRolesService.insertRequiredRole(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateRequiredRoleMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateRequiredRoleArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredRolesService.updateRequiredRoleMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteRequiredRole(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredRolesService.deleteRequiredRole(getSelectionSet(info), where);
  }
}

@Resolver('RequiredRole')
export class RequiredRolesQueryResolver {
  constructor(private readonly requiredRolesService: RequiredRolesService) {}

  @Query()
  async requiredRole(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredRolesService.findRequiredRole(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertRequiredRoleOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredRolesService.insertRequiredRoleOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async requiredRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredRolesService.findRequiredRoleByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateRequiredRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredRolesService.updateRequiredRoleByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteRequiredRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredRolesService.deleteRequiredRoleByPk(getSelectionSet(info), id);
  }
}

@Resolver('RequiredRoleAggregate')
export class RequiredRolesQueryAggregateResolver {
  constructor(private readonly requiredRolesService: RequiredRolesService) {}

  @Query()
  async requiredRoleAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateRequiredRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.requiredRolesService.aggregateRequiredRole(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
