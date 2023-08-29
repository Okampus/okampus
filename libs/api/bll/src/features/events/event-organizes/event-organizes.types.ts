import type {
  EventOrganizeInsertInput,
  EventOrganizeOnConflict,
  EventOrganizeSetInput,
  EventOrganizeBoolExp,
  EventOrganizeOrderBy,
  EventOrganizeSelectColumn,
  EventOrganizePkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertEventOrganizeArgsType = {
  objects: Array<EventOrganizeInsertInput>;
  onConflict?: EventOrganizeOnConflict;
};

export type InsertOneEventOrganizeArgsType = {
  object: EventOrganizeInsertInput;
  onConflict?: EventOrganizeOnConflict;
};

export type UpdateEventOrganizeArgsType = {
  where: EventOrganizeBoolExp;
  _set: EventOrganizeSetInput;
};

export type DeleteEventOrganizeArgsType = {
  where: EventOrganizeBoolExp;
};

export type DeleteByPkEventOrganizeArgsType = {
  id: string;
};

export type UpdateByPkEventOrganizeArgsType = {
  pkColumns: EventOrganizePkColumnsInput;
  _set: EventOrganizeSetInput;
};

export type FindEventOrganizeArgsType = {
  where: EventOrganizeBoolExp;
  orderBy?: Array<EventOrganizeOrderBy>;
  distinctOn?: Array<EventOrganizeSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventOrganizeArgsType = {
  id: string;
};

export type AggregateEventOrganizeArgsType = {
  where: EventOrganizeBoolExp;
  orderBy?: Array<EventOrganizeOrderBy>;
  distinctOn?: Array<EventOrganizeSelectColumn>;
  limit?: number;
  offset?: number;
};
