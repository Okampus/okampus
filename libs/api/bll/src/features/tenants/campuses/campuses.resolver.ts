import { CampusesService } from './campuses.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteCampusArgsType,
  DeleteByPkCampusArgsType,
  InsertOneCampusArgsType,
  InsertCampusArgsType,
  UpdateByPkCampusArgsType,
  UpdateCampusArgsType,
  FindCampusArgsType,
  FindByPkCampusArgsType,
  AggregateCampusArgsType,
} from './campuses.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('CampusMutationResponse')
export class CampusesMutationResolver {
  constructor(private readonly campusesService: CampusesService) {}

  @Mutation()
  async insertCampus(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertCampusArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusesService.insertCampus(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateCampusMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateCampusArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusesService.updateCampusMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteCampus(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteCampusArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusesService.deleteCampus(getSelectionSet(info), where);
  }
}

@Resolver('Campus')
export class CampusesQueryResolver {
  constructor(private readonly campusesService: CampusesService) {}

  @Query()
  async campus(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindCampusArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusesService.findCampus(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertCampusOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneCampusArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusesService.insertCampusOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async campusByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkCampusArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusesService.findCampusByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateCampusByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkCampusArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusesService.updateCampusByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteCampusByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkCampusArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusesService.deleteCampusByPk(getSelectionSet(info), id);
  }
}

@Resolver('CampusAggregate')
export class CampusesQueryAggregateResolver {
  constructor(private readonly campusesService: CampusesService) {}

  @Query()
  async campusAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateCampusArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.campusesService.aggregateCampus(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}
