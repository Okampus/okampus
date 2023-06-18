import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertBotInfoArgsType = {
  objects: Array<ValueTypes['BotInfoInsertInput']>;
  onConflict?: ValueTypes['BotInfoOnConflict'];
};

export type InsertOneBotInfoArgsType = {
  object: ValueTypes['BotInfoInsertInput'];
  onConflict?: ValueTypes['BotInfoOnConflict'];
};

export type UpdateBotInfoArgsType = {
  where: ValueTypes['BotInfoBoolExp'];
  _set: ValueTypes['BotInfoSetInput'];
};

export type DeleteBotInfoArgsType = {
  where: ValueTypes['BotInfoBoolExp'];
};

export type UpdateByPkBotInfoArgsType = {
  pkColumns: ValueTypes['BotInfoPkColumnsInput'];
  _set: ValueTypes['BotInfoSetInput'];
};

export type FindBotInfoArgsType = {
  where: ValueTypes['BotInfoBoolExp'];
  orderBy?: Array<ValueTypes['BotInfoOrderBy']>;
  distinctOn?: Array<ValueTypes['BotInfoSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkBotInfoArgsType = {
  id: string;
};

export type AggregateBotInfoArgsType = {
  where: ValueTypes['BotInfoBoolExp'];
  orderBy?: Array<ValueTypes['BotInfoOrderBy']>;
  distinctOn?: Array<ValueTypes['BotInfoSelectColumn']>;
  limit?: number;
  offset?: number;
};
