// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventJoinsService } from './event-joins.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertOneEventJoinArgsType,
  UpdateByPkEventJoinArgsType,
  FindEventJoinArgsType,
  FindByPkEventJoinArgsType,
  AggregateEventJoinArgsType,
} from './event-joins.types';

import type { GraphQLResolveInfo } from 'graphql';

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
    const data = await this.eventJoinsService.insertEventJoinOne(getSelectionSet(info), object, onConflict);
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

  @Mutation()
  async deleteEventJoinByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkEventJoinArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.eventJoinsService.deleteEventJoinByPk(getSelectionSet(info), pkColumns);
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
