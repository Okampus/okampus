import { LegalUnitLocationsService } from './legal-unit-locations.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteLegalUnitLocationArgsType,
  DeleteByPkLegalUnitLocationArgsType,
  InsertOneLegalUnitLocationArgsType,
  InsertLegalUnitLocationArgsType,
  UpdateByPkLegalUnitLocationArgsType,
  UpdateLegalUnitLocationArgsType,
  FindLegalUnitLocationArgsType,
  FindByPkLegalUnitLocationArgsType,
  AggregateLegalUnitLocationArgsType
} from './legal-unit-locations.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('LegalUnitLocationMutationResponse')
export class LegalUnitLocationsMutationResolver {
  constructor(private readonly legalUnitLocationsService: LegalUnitLocationsService) {}

  @Mutation()
  async insertLegalUnitLocation(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertLegalUnitLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitLocationsService.insertLegalUnitLocation(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateLegalUnitLocationMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateLegalUnitLocationArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitLocationsService.updateLegalUnitLocationMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteLegalUnitLocation(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteLegalUnitLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitLocationsService.deleteLegalUnitLocation(getSelectionSet(info), where);
  }
}

@Resolver('LegalUnitLocation')
export class LegalUnitLocationsQueryResolver {
  constructor(private readonly legalUnitLocationsService: LegalUnitLocationsService) {}

  @Query()
  async legalUnitLocation(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindLegalUnitLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitLocationsService.findLegalUnitLocation(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertLegalUnitLocationOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneLegalUnitLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitLocationsService.insertLegalUnitLocationOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async legalUnitLocationByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkLegalUnitLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitLocationsService.findLegalUnitLocationByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateLegalUnitLocationByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkLegalUnitLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitLocationsService.updateLegalUnitLocationByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteLegalUnitLocationByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkLegalUnitLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitLocationsService.deleteLegalUnitLocationByPk(getSelectionSet(info), id);
  }
}

@Resolver('LegalUnitLocationAggregate')
export class LegalUnitLocationsQueryAggregateResolver {
  constructor(private readonly legalUnitLocationsService: LegalUnitLocationsService) {}

  @Query()
  async legalUnitLocationAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateLegalUnitLocationArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitLocationsService.aggregateLegalUnitLocation(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
