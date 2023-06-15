// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalStepsService } from './event-approval-steps.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertOneEventApprovalStepArgsType,
  UpdateByPkEventApprovalStepArgsType,
  FindEventApprovalStepArgsType,
  FindByPkEventApprovalStepArgsType,
  AggregateEventApprovalStepArgsType,
} from './event-approval-steps.types';

import type { GraphQLResolveInfo } from 'graphql';

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
    return await this.eventApprovalStepsService.findEventApprovalStep(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }

  @Mutation()
  async insertEventApprovalStepOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneEventApprovalStepArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    const data = await this.eventApprovalStepsService.insertEventApprovalStepOne(
      getSelectionSet(info),
      object,
      onConflict
    );
    return data.returning[0];
  }

  @Query()
  async eventApprovalStepByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkEventApprovalStepArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalStepsService.findEventApprovalStepByPk(getSelectionSet(info), id);
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
    const { pkColumns } = getGraphQLArgs<UpdateByPkEventApprovalStepArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalStepsService.deleteEventApprovalStepByPk(getSelectionSet(info), pkColumns);
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
