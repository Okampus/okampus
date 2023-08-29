import { EventFavoritesService } from './event-favorites.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteEventFavoriteArgsType,
  DeleteByPkEventFavoriteArgsType,
  InsertOneEventFavoriteArgsType,
  InsertEventFavoriteArgsType,
  UpdateByPkEventFavoriteArgsType,
  UpdateEventFavoriteArgsType,
  FindEventFavoriteArgsType,
  FindByPkEventFavoriteArgsType,
  AggregateEventFavoriteArgsType,
} from './event-favorites.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('EventFavoriteMutationResponse')
export class EventFavoritesMutationResolver {
  constructor(private readonly eventFavoritesService: EventFavoritesService) {}

  @Mutation()
  async insertEventFavorite(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertEventFavoriteArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventFavoritesService.insertEventFavorite(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateEventFavoriteMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateEventFavoriteArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventFavoritesService.updateEventFavoriteMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteEventFavorite(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteEventFavoriteArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventFavoritesService.deleteEventFavorite(getSelectionSet(info), where);
  }
}

@Resolver('EventFavorite')
export class EventFavoritesQueryResolver {
  constructor(private readonly eventFavoritesService: EventFavoritesService) {}

  @Query()
  async eventFavorite(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindEventFavoriteArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventFavoritesService.findEventFavorite(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }

  @Mutation()
  async insertEventFavoriteOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneEventFavoriteArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventFavoritesService.insertEventFavoriteOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async eventFavoriteByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkEventFavoriteArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventFavoritesService.findEventFavoriteByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateEventFavoriteByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkEventFavoriteArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventFavoritesService.updateEventFavoriteByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteEventFavoriteByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkEventFavoriteArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventFavoritesService.deleteEventFavoriteByPk(getSelectionSet(info), id);
  }
}

@Resolver('EventFavoriteAggregate')
export class EventFavoritesQueryAggregateResolver {
  constructor(private readonly eventFavoritesService: EventFavoritesService) {}

  @Query()
  async eventFavoriteAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateEventFavoriteArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.eventFavoritesService.aggregateEventFavorite(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
