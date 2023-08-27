import { EventJoinsService } from './event-joins.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteEventJoinArgsType,
  DeleteByPkEventJoinArgsType,
  InsertOneEventJoinArgsType,
  InsertEventJoinArgsType,
  UpdateByPkEventJoinArgsType,
  UpdateEventJoinArgsType,
  FindEventJoinArgsType,
  FindByPkEventJoinArgsType,
  AggregateEventJoinArgsType
} from './event-joins.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('EventJoinMutationResponse')
export class EventJoinsMutationResolver {
  constructor(private readonly eventJoinsService: EventJoinsService) {}

  @Mutation()
  async insertEventJoin(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertEventJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.insertEventJoin(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateEventJoinMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateEventJoinArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.updateEventJoinMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteEventJoin(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteEventJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.deleteEventJoin(getSelectionSet(info), where);
  }
}

@Resolver('EventJoin')
export class EventJoinsQueryResolver {
  constructor(private readonly eventJoinsService: EventJoinsService) {}

  @Query()
  async eventJoin(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindEventJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.findEventJoin(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }


  @Mutation()
  async insertEventJoinOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneEventJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.insertEventJoinOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async eventJoinByPk(@Info() info: GraphQLResolveInfo) {
    const {  id,  } = getGraphQLArgs<FindByPkEventJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.findEventJoinByPk(getSelectionSet(info),  id, );
  }

  @Mutation()
  async updateEventJoinByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkEventJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.updateEventJoinByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteEventJoinByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkEventJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.deleteEventJoinByPk(getSelectionSet(info), id);
  }
}

@Resolver('EventJoinAggregate')
export class EventJoinsQueryAggregateResolver {
  constructor(private readonly eventJoinsService: EventJoinsService) {}

  @Query()
  async eventJoinAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateEventJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.aggregateEventJoin(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
