import type {
  BotInsertInput,
  BotOnConflict,
  BotSetInput,
  BotBoolExp,
  BotOrderBy,
  BotSelectColumn,
  BotPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertBotArgsType = {
  objects: Array<BotInsertInput>;
  onConflict?: BotOnConflict;
};

export type InsertOneBotArgsType = {
  object: BotInsertInput;
  onConflict?: BotOnConflict;
};

export type UpdateBotArgsType = {
  where: BotBoolExp;
  _set: BotSetInput;
};

export type DeleteBotArgsType = {
  where: BotBoolExp;
};

export type DeleteByPkBotArgsType = {
  id: string;
};

export type UpdateByPkBotArgsType = {
  pkColumns: BotPkColumnsInput;
  _set: BotSetInput;
};

export type FindBotArgsType = {
  where: BotBoolExp;
  orderBy?: Array<BotOrderBy>;
  distinctOn?: Array<BotSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkBotArgsType = {
  id: string;
};

export type AggregateBotArgsType = {
  where: BotBoolExp;
  orderBy?: Array<BotOrderBy>;
  distinctOn?: Array<BotSelectColumn>;
  limit?: number;
  offset?: number;
};
