import type {
  ShortcutInsertInput,
  ShortcutOnConflict,
  ShortcutSetInput,
  ShortcutBoolExp,
  ShortcutOrderBy,
  ShortcutSelectColumn,
  ShortcutPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertShortcutArgsType = {
  objects: Array<ShortcutInsertInput>;
  onConflict?: ShortcutOnConflict;
};

export type InsertOneShortcutArgsType = {
  object: ShortcutInsertInput;
  onConflict?: ShortcutOnConflict;
};

export type UpdateShortcutArgsType = {
  where: ShortcutBoolExp;
  _set: ShortcutSetInput;
};

export type DeleteShortcutArgsType = {
  where: ShortcutBoolExp;
};

export type DeleteByPkShortcutArgsType = {
  id: string;
};

export type UpdateByPkShortcutArgsType = {
  pkColumns: ShortcutPkColumnsInput;
  _set: ShortcutSetInput;
};

export type FindShortcutArgsType = {
  where: ShortcutBoolExp;
  orderBy?: Array<ShortcutOrderBy>;
  distinctOn?: Array<ShortcutSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkShortcutArgsType = {
  id: string;
};

export type AggregateShortcutArgsType = {
  where: ShortcutBoolExp;
  orderBy?: Array<ShortcutOrderBy>;
  distinctOn?: Array<ShortcutSelectColumn>;
  limit?: number;
  offset?: number;
};
