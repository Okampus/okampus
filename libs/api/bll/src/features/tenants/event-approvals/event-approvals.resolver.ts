// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalsService } from './event-approvals.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteEventApprovalArgsType,
  InsertOneEventApprovalArgsType,
  InsertEventApprovalArgsType,
  UpdateByPkEventApprovalArgsType,
  UpdateEventApprovalArgsType,
  FindEventApprovalArgsType,
  FindByPkEventApprovalArgsType,
  AggregateEventApprovalArgsType,
} from './event-approvals.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('EventApprovalMutationResponse')
export class EventApprovalsMutationResolver {
  constructor(private readonly eventApprovalsService: EventApprovalsService) {}

  @Mutation()
  async insertEventApproval(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertEventApprovalArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalsService.insertEventApproval(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateEventApprovalMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateEventApprovalArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalsService.updateEventApprovalMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteEventApproval(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteEventApprovalArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalsService.deleteEventApproval(getSelectionSet(info), where);
  }
}

@Resolver('EventApproval')
export class EventApprovalsQueryResolver {
  constructor(private readonly eventApprovalsService: EventApprovalsService) {}

  @Query()
  async eventApproval(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindEventApprovalArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalsService.findEventApproval(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }

  @Mutation()
  async insertEventApprovalOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneEventApprovalArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalsService.insertEventApprovalOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async eventApprovalByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkEventApprovalArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalsService.findEventApprovalByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateEventApprovalByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkEventApprovalArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalsService.updateEventApprovalByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteEventApprovalByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkEventApprovalArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalsService.deleteEventApprovalByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('EventApprovalAggregate')
export class EventApprovalsQueryAggregateResolver {
  constructor(private readonly eventApprovalsService: EventApprovalsService) {}

  @Query()
  async eventApprovalAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateEventApprovalArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventApprovalsService.aggregateEventApproval(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
