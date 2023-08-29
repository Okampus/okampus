import { EventOrganizesService } from './event-organizes.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteEventOrganizeArgsType,
  DeleteByPkEventOrganizeArgsType,
  InsertOneEventOrganizeArgsType,
  InsertEventOrganizeArgsType,
  UpdateByPkEventOrganizeArgsType,
  UpdateEventOrganizeArgsType,
  FindEventOrganizeArgsType,
  FindByPkEventOrganizeArgsType,
  AggregateEventOrganizeArgsType,
} from './event-organizes.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('EventOrganizeMutationResponse')
export class EventOrganizesMutationResolver {
  constructor(private readonly eventOrganizesService: EventOrganizesService) {}

  @Mutation()
  async insertEventOrganize(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertEventOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventOrganizesService.insertEventOrganize(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateEventOrganizeMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateEventOrganizeArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventOrganizesService.updateEventOrganizeMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteEventOrganize(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteEventOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventOrganizesService.deleteEventOrganize(getSelectionSet(info), where);
  }
}

@Resolver('EventOrganize')
export class EventOrganizesQueryResolver {
  constructor(private readonly eventOrganizesService: EventOrganizesService) {}

  @Query()
  async eventOrganize(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindEventOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventOrganizesService.findEventOrganize(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertEventOrganizeOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneEventOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventOrganizesService.insertEventOrganizeOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async eventOrganizeByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkEventOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventOrganizesService.findEventOrganizeByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateEventOrganizeByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkEventOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventOrganizesService.updateEventOrganizeByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteEventOrganizeByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkEventOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventOrganizesService.deleteEventOrganizeByPk(getSelectionSet(info), id);
  }
}

@Resolver('EventOrganizeAggregate')
export class EventOrganizesQueryAggregateResolver {
  constructor(private readonly eventOrganizesService: EventOrganizesService) {}

  @Query()
  async eventOrganizeAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateEventOrganizeArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventOrganizesService.aggregateEventOrganize(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
