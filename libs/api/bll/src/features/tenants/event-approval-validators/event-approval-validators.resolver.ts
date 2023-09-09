import { EventApprovalValidatorsService } from './event-approval-validators.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteEventApprovalValidatorArgsType,
  DeleteByPkEventApprovalValidatorArgsType,
  InsertOneEventApprovalValidatorArgsType,
  InsertEventApprovalValidatorArgsType,
  UpdateByPkEventApprovalValidatorArgsType,
  UpdateEventApprovalValidatorArgsType,
  FindEventApprovalValidatorArgsType,
  FindByPkEventApprovalValidatorArgsType,
  AggregateEventApprovalValidatorArgsType,
} from './event-approval-validators.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('EventApprovalValidatorMutationResponse')
export class EventApprovalValidatorsMutationResolver {
  constructor(private readonly eventApprovalValidatorsService: EventApprovalValidatorsService) {}

  @Mutation()
  async insertEventApprovalValidator(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertEventApprovalValidatorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventApprovalValidatorsService.insertEventApprovalValidator(
      getSelectionSet(info),
      objects,
      onConflict,
    );
  }

  @Mutation()
  async updateEventApprovalValidatorMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateEventApprovalValidatorArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventApprovalValidatorsService.updateEventApprovalValidatorMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteEventApprovalValidator(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteEventApprovalValidatorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventApprovalValidatorsService.deleteEventApprovalValidator(getSelectionSet(info), where);
  }
}

@Resolver('EventApprovalValidator')
export class EventApprovalValidatorsQueryResolver {
  constructor(private readonly eventApprovalValidatorsService: EventApprovalValidatorsService) {}

  @Query()
  async eventApprovalValidator(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindEventApprovalValidatorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventApprovalValidatorsService.findEventApprovalValidator(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertEventApprovalValidatorOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneEventApprovalValidatorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventApprovalValidatorsService.insertEventApprovalValidatorOne(
      getSelectionSet(info),
      object,
      onConflict,
    );
  }

  @Query()
  async eventApprovalValidatorByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkEventApprovalValidatorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventApprovalValidatorsService.findEventApprovalValidatorByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateEventApprovalValidatorByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkEventApprovalValidatorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventApprovalValidatorsService.updateEventApprovalValidatorByPk(
      getSelectionSet(info),
      pkColumns,
      _set,
    );
  }

  @Mutation()
  async deleteEventApprovalValidatorByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkEventApprovalValidatorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventApprovalValidatorsService.deleteEventApprovalValidatorByPk(getSelectionSet(info), id);
  }
}

@Resolver('EventApprovalValidatorAggregate')
export class EventApprovalValidatorsQueryAggregateResolver {
  constructor(private readonly eventApprovalValidatorsService: EventApprovalValidatorsService) {}

  @Query()
  async eventApprovalValidatorAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateEventApprovalValidatorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventApprovalValidatorsService.aggregateEventApprovalValidator(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
