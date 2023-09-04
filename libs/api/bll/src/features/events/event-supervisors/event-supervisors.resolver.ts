import { EventSupervisorsService } from './event-supervisors.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';

import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteEventSupervisorArgsType,
  DeleteByPkEventSupervisorArgsType,
  InsertOneEventSupervisorArgsType,
  InsertEventSupervisorArgsType,
  UpdateByPkEventSupervisorArgsType,
  UpdateEventSupervisorArgsType,
  FindEventSupervisorArgsType,
  FindByPkEventSupervisorArgsType,
  AggregateEventSupervisorArgsType
} from './event-supervisors.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('EventSupervisorMutationResponse')
export class EventSupervisorsMutationResolver {
  constructor(private readonly eventSupervisorsService: EventSupervisorsService) {}

  @Mutation()
  async insertEventSupervisor(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertEventSupervisorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventSupervisorsService.insertEventSupervisor(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateEventSupervisorMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateEventSupervisorArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventSupervisorsService.updateEventSupervisorMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteEventSupervisor(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteEventSupervisorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventSupervisorsService.deleteEventSupervisor(getSelectionSet(info), where);
  }
}

@Resolver('EventSupervisor')
export class EventSupervisorsQueryResolver {
  constructor(private readonly eventSupervisorsService: EventSupervisorsService) {}

  @Query()
  async eventSupervisor(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindEventSupervisorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventSupervisorsService.findEventSupervisor(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertEventSupervisorOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneEventSupervisorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventSupervisorsService.insertEventSupervisorOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async eventSupervisorByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkEventSupervisorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventSupervisorsService.findEventSupervisorByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateEventSupervisorByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkEventSupervisorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventSupervisorsService.updateEventSupervisorByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteEventSupervisorByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkEventSupervisorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventSupervisorsService.deleteEventSupervisorByPk(getSelectionSet(info), id);
  }
}

@Resolver('EventSupervisorAggregate')
export class EventSupervisorsQueryAggregateResolver {
  constructor(private readonly eventSupervisorsService: EventSupervisorsService) {}

  @Query()
  async eventSupervisorAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateEventSupervisorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventSupervisorsService.aggregateEventSupervisor(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
