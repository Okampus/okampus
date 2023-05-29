// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventsService } from './events.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertEventArgsType,
  InsertOneEventArgsType,
  UpdateEventArgsType,
  UpdateByPkEventArgsType,
  FindEventArgsType,
  FindByPkEventArgsType,
  AggregateEventArgsType,
} from './events.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('EventMutationResponse')
export class EventsMutationResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Mutation()
  async insertEvent(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertEventArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventsService.insertEvent(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateEvent(@Info() info: GraphQLResolveInfo) {
    const { where, _set } = getGraphQLArgs<UpdateEventArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventsService.updateEvent(getSelectionSet(info), where, _set);
  }
}

@Resolver('Event')
export class EventsQueryResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query()
  async event(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindEventArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventsService.findEvent(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertEventOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneEventArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    const data = await this.eventsService.insertEvent(getSelectionSet(info), [object], onConflict, true);
    return data.returning[0];
  }

  @Query()
  async eventByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkEventArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventsService.findEventByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateEventByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkEventArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventsService.updateEventByPk(getSelectionSet(info), pkColumns, _set);
  }
}

@Resolver('EventAggregate')
export class EventsQueryAggregateResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Query()
  async eventAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateEventArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventsService.aggregateEvent(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}
