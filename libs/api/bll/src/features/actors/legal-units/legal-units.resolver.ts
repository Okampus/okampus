import { LegalUnitsService } from './legal-units.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteLegalUnitArgsType,
  InsertOneLegalUnitArgsType,
  InsertLegalUnitArgsType,
  UpdateByPkLegalUnitArgsType,
  UpdateLegalUnitArgsType,
  FindLegalUnitArgsType,
  FindByPkLegalUnitArgsType,
  AggregateLegalUnitArgsType,
} from './legal-units.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('LegalUnitMutationResponse')
export class LegalUnitsMutationResolver {
  constructor(private readonly legalUnitsService: LegalUnitsService) {}

  @Mutation()
  async insertLegalUnit(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertLegalUnitArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitsService.insertLegalUnit(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateLegalUnitMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateLegalUnitArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitsService.updateLegalUnitMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteLegalUnit(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteLegalUnitArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitsService.deleteLegalUnit(getSelectionSet(info), where);
  }
}

@Resolver('LegalUnit')
export class LegalUnitsQueryResolver {
  constructor(private readonly legalUnitsService: LegalUnitsService) {}

  @Query()
  async legalUnit(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindLegalUnitArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitsService.findLegalUnit(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertLegalUnitOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneLegalUnitArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitsService.insertLegalUnitOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async legalUnitByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkLegalUnitArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitsService.findLegalUnitByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateLegalUnitByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkLegalUnitArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitsService.updateLegalUnitByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteLegalUnitByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkLegalUnitArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitsService.deleteLegalUnitByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('LegalUnitAggregate')
export class LegalUnitsQueryAggregateResolver {
  constructor(private readonly legalUnitsService: LegalUnitsService) {}

  @Query()
  async legalUnitAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateLegalUnitArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.legalUnitsService.aggregateLegalUnit(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
