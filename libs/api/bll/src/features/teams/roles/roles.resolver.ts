import { RolesService } from './roles.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteRoleArgsType,
  DeleteByPkRoleArgsType,
  InsertOneRoleArgsType,
  InsertRoleArgsType,
  UpdateByPkRoleArgsType,
  UpdateRoleArgsType,
  FindRoleArgsType,
  FindByPkRoleArgsType,
  AggregateRoleArgsType
} from './roles.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('RoleMutationResponse')
export class RolesMutationResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation()
  async insertRole(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.rolesService.insertRole(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateRoleMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateRoleArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.rolesService.updateRoleMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteRole(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.rolesService.deleteRole(getSelectionSet(info), where);
  }
}

@Resolver('Role')
export class RolesQueryResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query()
  async role(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.rolesService.findRole(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertRoleOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.rolesService.insertRoleOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async roleByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.rolesService.findRoleByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.rolesService.updateRoleByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteRoleByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.rolesService.deleteRoleByPk(getSelectionSet(info), id);
  }
}

@Resolver('RoleAggregate')
export class RolesQueryAggregateResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Query()
  async roleAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateRoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.rolesService.aggregateRole(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
