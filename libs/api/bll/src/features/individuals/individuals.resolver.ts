import { IndividualsService } from './individuals.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteIndividualArgsType,
  InsertOneIndividualArgsType,
  InsertIndividualArgsType,
  UpdateByPkIndividualArgsType,
  UpdateIndividualArgsType,
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
  async updateIndividualMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateIndividualArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.individualsService.updateIndividualMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteIndividual(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteIndividualArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.individualsService.deleteIndividual(getSelectionSet(info), where);
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
    return await this.individualsService.insertIndividualOne(getSelectionSet(info), object, onConflict);
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

  @Mutation()
  async deleteIndividualByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkIndividualArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.individualsService.deleteIndividualByPk(getSelectionSet(info), pkColumns);
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
