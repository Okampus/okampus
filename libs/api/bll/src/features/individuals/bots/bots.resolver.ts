// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BotsService } from './bots.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  DeleteBotArgsType,
  InsertOneBotArgsType,
  InsertBotArgsType,
  UpdateByPkBotArgsType,
  UpdateBotArgsType,
  FindBotArgsType,
  FindByPkBotArgsType,
  AggregateBotArgsType,
} from './bots.types';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver('BotMutationResponse')
export class BotsMutationResolver {
  constructor(private readonly botsService: BotsService) {}

  @Mutation()
  async insertBot(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertBotArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botsService.insertBot(getSelectionSet(info), objects, onConflict);
  }

  @Mutation()
  async updateBotMany(@Info() info: GraphQLResolveInfo) {
    const { updates } = getGraphQLArgs<{ updates: UpdateBotArgsType[] }>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botsService.updateBotMany(getSelectionSet(info), updates);
  }

  @Mutation()
  async deleteBot(@Info() info: GraphQLResolveInfo) {
    const { where } = getGraphQLArgs<DeleteBotArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botsService.deleteBot(getSelectionSet(info), where);
  }
}

@Resolver('Bot')
export class BotsQueryResolver {
  constructor(private readonly botsService: BotsService) {}

  @Query()
  async bot(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindBotArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botsService.findBot(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertBotOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneBotArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botsService.insertBotOne(getSelectionSet(info), object, onConflict);
  }

  @Query()
  async botByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkBotArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botsService.findBotByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateBotByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkBotArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botsService.updateBotByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteBotByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkBotArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botsService.deleteBotByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('BotAggregate')
export class BotsQueryAggregateResolver {
  constructor(private readonly botsService: BotsService) {}

  @Query()
  async botAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateBotArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botsService.aggregateBot(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }
}
