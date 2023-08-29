import { SessionsService } from './sessions.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteSessionArgsType,
  DeleteByPkSessionArgsType,
  InsertOneSessionArgsType,
  InsertSessionArgsType,
  UpdateByPkSessionArgsType,
  UpdateSessionArgsType,
  FindSessionArgsType,
  FindByPkSessionArgsType,
  AggregateSessionArgsType,
} from './sessions.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('SessionMutationResponse')
export class SessionsMutationResolver {
  constructor(private readonly sessionsService: SessionsService) {}

  @Mutation()
  async insertSession(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertSessionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.sessionsService.insertSession(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateSessionMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateSessionArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.sessionsService.updateSessionMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteSession(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteSessionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.sessionsService.deleteSession(getSelectionSet(info), where);
  }
}

@Resolver('Session')
export class SessionsQueryResolver {
  constructor(private readonly sessionsService: SessionsService) {}

  @Query()
  async session(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindSessionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.sessionsService.findSession(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertSessionOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneSessionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.sessionsService.insertSessionOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async sessionByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkSessionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.sessionsService.findSessionByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateSessionByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkSessionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.sessionsService.updateSessionByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteSessionByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<DeleteByPkSessionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.sessionsService.deleteSessionByPk(getSelectionSet(info), id);
  }
}

@Resolver('SessionAggregate')
export class SessionsQueryAggregateResolver {
  constructor(private readonly sessionsService: SessionsService) {}

  @Query()
  async sessionAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateSessionArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues,
    );
    return await this.sessionsService.aggregateSession(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
  }
}
