import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertBotArgsType = {
  objects: Array<ValueTypes['BotInsertInput']>;
  onConflict?: ValueTypes['BotOnConflict'];
};

export type InsertOneBotArgsType = {
  object: ValueTypes['BotInsertInput'];
  onConflict?: ValueTypes['BotOnConflict'];
};

export type UpdateBotArgsType = {
  where: ValueTypes['BotBoolExp'];
  _set: ValueTypes['BotSetInput'];
};

export type DeleteBotArgsType = {
  where: ValueTypes['BotBoolExp'];
};

export type UpdateByPkBotArgsType = {
  pkColumns: ValueTypes['BotPkColumnsInput'];
  _set: ValueTypes['BotSetInput'];
};

export type FindBotArgsType = {
  where: ValueTypes['BotBoolExp'];
  orderBy?: Array<ValueTypes['BotOrderBy']>;
  distinctOn?: Array<ValueTypes['BotSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkBotArgsType = {
  id: string;
};

export type AggregateBotArgsType = {
  where: ValueTypes['BotBoolExp'];
  orderBy?: Array<ValueTypes['BotOrderBy']>;
  distinctOn?: Array<ValueTypes['BotSelectColumn']>;
  limit?: number;
  offset?: number;
};
