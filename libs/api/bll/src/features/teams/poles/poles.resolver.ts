import { PolesService } from './poles.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeletePoleArgsType,
  DeleteByPkPoleArgsType,
  InsertOnePoleArgsType,
  InsertPoleArgsType,
  UpdateByPkPoleArgsType,
  UpdatePoleArgsType,
  FindPoleArgsType,
  FindByPkPoleArgsType,
  AggregatePoleArgsType
} from './poles.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('PoleMutationResponse')
export class PolesMutationResolver {
  constructor(private readonly polesService: PolesService) {}

  @Mutation()
  async insertPole(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertPoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.polesService.insertPole(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updatePoleMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdatePoleArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.polesService.updatePoleMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deletePole(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeletePoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.polesService.deletePole(getSelectionSet(info), where);
  }
}

@Resolver('Pole')
export class PolesQueryResolver {
  constructor(private readonly polesService: PolesService) {}

  @Query()
  async pole(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindPoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.polesService.findPole(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertPoleOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOnePoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.polesService.insertPoleOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async poleByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkPoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.polesService.findPoleByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updatePoleByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkPoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.polesService.updatePoleByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deletePoleByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkPoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.polesService.deletePoleByPk(getSelectionSet(info), id);
  }
}

@Resolver('PoleAggregate')
export class PolesQueryAggregateResolver {
  constructor(private readonly polesService: PolesService) {}

  @Query()
  async poleAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregatePoleArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.polesService.aggregatePole(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
