import { GrantsService } from './grants.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteGrantArgsType,
  DeleteByPkGrantArgsType,
  InsertOneGrantArgsType,
  InsertGrantArgsType,
  UpdateByPkGrantArgsType,
  UpdateGrantArgsType,
  FindGrantArgsType,
  FindByPkGrantArgsType,
  AggregateGrantArgsType,
} from './grants.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('GrantMutationResponse')
export class GrantsMutationResolver {
  constructor(private readonly grantsService: GrantsService) {}

  @Mutation()
  async insertGrant(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertGrantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantsService.insertGrant(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateGrantMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateGrantArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantsService.updateGrantMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteGrant(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteGrantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantsService.deleteGrant(getSelectionSet(info), where);
  }
}

@Resolver('Grant')
export class GrantsQueryResolver {
  constructor(private readonly grantsService: GrantsService) {}

  @Query()
  async grant(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindGrantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantsService.findGrant(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertGrantOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneGrantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantsService.insertGrantOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async grantByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkGrantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantsService.findGrantByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateGrantByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkGrantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantsService.updateGrantByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteGrantByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkGrantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantsService.deleteGrantByPk(getSelectionSet(info), id);
  }
}

@Resolver('GrantAggregate')
export class GrantsQueryAggregateResolver {
  constructor(private readonly grantsService: GrantsService) {}

  @Query()
  async grantAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateGrantArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.grantsService.aggregateGrant(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}
