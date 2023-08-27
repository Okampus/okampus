import { EventApprovalStepsService } from './event-approval-steps.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteEventApprovalStepArgsType,
  DeleteByPkEventApprovalStepArgsType,
  InsertOneEventApprovalStepArgsType,
  InsertEventApprovalStepArgsType,
  UpdateByPkEventApprovalStepArgsType,
  UpdateEventApprovalStepArgsType,
  FindEventApprovalStepArgsType,
  FindByPkEventApprovalStepArgsType,
  AggregateEventApprovalStepArgsType
} from './event-approval-steps.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('EventApprovalStepMutationResponse')
export class EventApprovalStepsMutationResolver {
  constructor(private readonly eventApprovalStepsService: EventApprovalStepsService) {}

  @Mutation()
  async insertEventApprovalStep(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertEventApprovalStepArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalStepsService.insertEventApprovalStep(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateEventApprovalStepMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateEventApprovalStepArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalStepsService.updateEventApprovalStepMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteEventApprovalStep(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteEventApprovalStepArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalStepsService.deleteEventApprovalStep(getSelectionSet(info), where);
  }
}

@Resolver('EventApprovalStep')
export class EventApprovalStepsQueryResolver {
  constructor(private readonly eventApprovalStepsService: EventApprovalStepsService) {}

  @Query()
  async eventApprovalStep(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindEventApprovalStepArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalStepsService.findEventApprovalStep(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertEventApprovalStepOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneEventApprovalStepArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalStepsService.insertEventApprovalStepOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async eventApprovalStepByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkEventApprovalStepArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalStepsService.findEventApprovalStepByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateEventApprovalStepByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkEventApprovalStepArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalStepsService.updateEventApprovalStepByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteEventApprovalStepByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkEventApprovalStepArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalStepsService.deleteEventApprovalStepByPk(getSelectionSet(info), id);
  }
}

@Resolver('EventApprovalStepAggregate')
export class EventApprovalStepsQueryAggregateResolver {
  constructor(private readonly eventApprovalStepsService: EventApprovalStepsService) {}

  @Query()
  async eventApprovalStepAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateEventApprovalStepArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalStepsService.aggregateEventApprovalStep(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
