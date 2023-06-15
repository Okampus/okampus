// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorsService } from './actors.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertOneActorArgsType,
  UpdateByPkActorArgsType,
  FindActorArgsType,
  FindByPkActorArgsType,
  AggregateActorArgsType,
} from './actors.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('Actor')
export class ActorsQueryResolver {
  constructor(private readonly actorsService: ActorsService) {}

  @Query()
  async actor(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindActorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorsService.findActor(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertActorOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneActorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    const data = await this.actorsService.insertActorOne(getSelectionSet(info), object, onConflict);
    return data.returning[0];
  }

  @Query()
  async actorByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkActorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorsService.findActorByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateActorByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkActorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorsService.updateActorByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteActorByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkActorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorsService.deleteActorByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('ActorAggregate')
export class ActorsQueryAggregateResolver {
  constructor(private readonly actorsService: ActorsService) {}

  @Query()
  async actorAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateActorArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.actorsService.aggregateActor(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}
