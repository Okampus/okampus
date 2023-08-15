import type {
  ActionInsertInput,
  ActionOnConflict,
  ActionSetInput,
  ActionBoolExp,
  ActionOrderBy,
  ActionSelectColumn,
  ActionPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertActionArgsType = {
  objects: Array<ActionInsertInput>;
  onConflict?: ActionOnConflict;
};

export type InsertOneActionArgsType = {
  object: ActionInsertInput;
  onConflict?: ActionOnConflict;
};

export type UpdateActionArgsType = {
  where: ActionBoolExp;
  _set: ActionSetInput;
};

export type DeleteActionArgsType = {
  where: ActionBoolExp;
};

export type UpdateByPkActionArgsType = {
  pkColumns: ActionPkColumnsInput;
  _set: ActionSetInput;
};

export type FindActionArgsType = {
  where: ActionBoolExp;
  orderBy?: Array<ActionOrderBy>;
  distinctOn?: Array<ActionSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkActionArgsType = {
  id: string;
};

export type AggregateActionArgsType = {
  where: ActionBoolExp;
  orderBy?: Array<ActionOrderBy>;
  distinctOn?: Array<ActionSelectColumn>;
  limit?: number;
  offset?: number;
};
