// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { IndividualsService } from './individuals.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertIndividualArgsType,
  InsertOneIndividualArgsType,
  UpdateIndividualArgsType,
  UpdateByPkIndividualArgsType,
  FindIndividualArgsType,
  FindByPkIndividualArgsType,
  AggregateIndividualArgsType,
} from './individuals.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('IndividualMutationResponse')
export class IndividualsMutationResolver {
  constructor(private readonly individualsService: IndividualsService) {}

  @Mutation()
  async insertIndividual(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertIndividualArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.individualsService.insertIndividual(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateIndividual(@Info() info: GraphQLResolveInfo) {
    const { where, _set } = getGraphQLArgs<UpdateIndividualArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.individualsService.updateIndividual(getSelectionSet(info), where, _set);
  }
}

@Resolver('Individual')
export class IndividualsQueryResolver {
  constructor(private readonly individualsService: IndividualsService) {}

  @Query()
  async individual(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindIndividualArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.individualsService.findIndividual(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }

  @Mutation()
  async insertIndividualOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneIndividualArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    const data = await this.individualsService.insertIndividual(getSelectionSet(info), [object], onConflict, true);
    return data.returning[0];
  }

  @Query()
  async individualByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkIndividualArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.individualsService.findIndividualByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateIndividualByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkIndividualArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.individualsService.updateIndividualByPk(getSelectionSet(info), pkColumns, _set);
  }
}

@Resolver('IndividualAggregate')
export class IndividualsQueryAggregateResolver {
  constructor(private readonly individualsService: IndividualsService) {}

  @Query()
  async individualAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateIndividualArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.individualsService.aggregateIndividual(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
