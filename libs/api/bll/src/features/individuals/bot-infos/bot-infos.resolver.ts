// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BotInfosService } from './bot-infos.service';
import { Query, Mutation, Resolver, Info } from '@nestjs/graphql';
import { getSelectionSet, getGraphQLArgs } from '@okampus/shared/utils';

import type {
  InsertBotInfoArgsType,
  InsertOneBotInfoArgsType,
  UpdateByPkBotInfoArgsType,
  FindBotInfoArgsType,
  FindByPkBotInfoArgsType,
  AggregateBotInfoArgsType,
} from './bot-infos.types';

import type { GraphQLResolveInfo } from 'graphql';

@Resolver('BotInfoMutationResponse')
export class BotInfosMutationResolver {
  constructor(private readonly botInfosService: BotInfosService) {}

  @Mutation()
  async insertBotInfo(@Info() info: GraphQLResolveInfo) {
    const { objects, onConflict } = getGraphQLArgs<InsertBotInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botInfosService.insertBotInfo(getSelectionSet(info), objects, onConflict);
  }
}

@Resolver('BotInfo')
export class BotInfosQueryResolver {
  constructor(private readonly botInfosService: BotInfosService) {}

  @Query()
  async botInfo(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<FindBotInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botInfosService.findBotInfo(getSelectionSet(info), where, orderBy, distinctOn, limit, offset);
  }

  @Mutation()
  async insertBotInfoOne(@Info() info: GraphQLResolveInfo) {
    const { object, onConflict } = getGraphQLArgs<InsertOneBotInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    const data = await this.botInfosService.insertBotInfo(getSelectionSet(info), [object], onConflict, true);
    return data.returning[0];
  }

  @Query()
  async botInfoByPk(@Info() info: GraphQLResolveInfo) {
    const { id } = getGraphQLArgs<FindByPkBotInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botInfosService.findBotInfoByPk(getSelectionSet(info), id);
  }

  @Mutation()
  async updateBotInfoByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns, _set } = getGraphQLArgs<UpdateByPkBotInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botInfosService.updateBotInfoByPk(getSelectionSet(info), pkColumns, _set);
  }

  @Mutation()
  async deleteBotInfoByPk(@Info() info: GraphQLResolveInfo) {
    const { pkColumns } = getGraphQLArgs<UpdateByPkBotInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botInfosService.deleteBotInfoByPk(getSelectionSet(info), pkColumns);
  }
}

@Resolver('BotInfoAggregate')
export class BotInfosQueryAggregateResolver {
  constructor(private readonly botInfosService: BotInfosService) {}

  @Query()
  async botInfoAggregate(@Info() info: GraphQLResolveInfo) {
    const { where, orderBy, distinctOn, limit, offset } = getGraphQLArgs<AggregateBotInfoArgsType>(
      info.parentType.getFields()[info.fieldName],
      info.fieldNodes[0],
      info.variableValues
    );
    return await this.botInfosService.aggregateBotInfo(
      getSelectionSet(info),
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
  }
}
