// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventJoinsService } from './event-joins.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertEventJoinArgsType,
  InsertOneEventJoinArgsType,
  UpdateEventJoinArgsType,
  UpdateByPkEventJoinArgsType,
  FindEventJoinArgsType,
  FindByPkEventJoinArgsType,
  AggregateEventJoinArgsType,
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
  async updateEventJoin(@Info() info: GraphQLResolveInfo) {
    const { where, _set } = getGraphQLArgs<UpdateEventJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.updateEventJoin(getSelectionSet(info), where, _set);
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
    const data = await this.eventJoinsService.insertEventJoin(getSelectionSet(info), [object], onConflict, true);
    return data.returning[0];
  }

  @Query()
  async eventJoinByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkEventJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.findEventJoinByPk(getSelectionSet(info), id);
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
