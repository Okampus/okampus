import { GrantAllocatesService } from './grant-allocates.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteGrantAllocateArgsType,
  DeleteByPkGrantAllocateArgsType,
  InsertOneGrantAllocateArgsType,
  InsertGrantAllocateArgsType,
  UpdateByPkGrantAllocateArgsType,
  UpdateGrantAllocateArgsType,
  FindGrantAllocateArgsType,
  FindByPkGrantAllocateArgsType,
  AggregateGrantAllocateArgsType,
} from './grant-allocates.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('GrantAllocateMutationResponse')
export class GrantAllocatesMutationResolver {
  constructor(private readonly grantAllocatesService: GrantAllocatesService) {}

  @Mutation()
  async insertGrantAllocate(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertGrantAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantAllocatesService.insertGrantAllocate(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateGrantAllocateMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateGrantAllocateArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantAllocatesService.updateGrantAllocateMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteGrantAllocate(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteGrantAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantAllocatesService.deleteGrantAllocate(getSelectionSet(info), where);
  }
}

@Resolver('GrantAllocate')
export class GrantAllocatesQueryResolver {
  constructor(private readonly grantAllocatesService: GrantAllocatesService) {}

  @Query()
  async grantAllocate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindGrantAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantAllocatesService.findGrantAllocate(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertGrantAllocateOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneGrantAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantAllocatesService.insertGrantAllocateOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async grantAllocateByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkGrantAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantAllocatesService.findGrantAllocateByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateGrantAllocateByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkGrantAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantAllocatesService.updateGrantAllocateByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteGrantAllocateByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkGrantAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantAllocatesService.deleteGrantAllocateByPk(getSelectionSet(info), id);
  }
}

@Resolver('GrantAllocateAggregate')
export class GrantAllocatesQueryAggregateResolver {
  constructor(private readonly grantAllocatesService: GrantAllocatesService) {}

  @Query()
  async grantAllocateAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateGrantAllocateArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantAllocatesService.aggregateGrantAllocate(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
