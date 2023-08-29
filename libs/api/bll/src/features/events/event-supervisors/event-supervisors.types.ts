import type {
  EventSupervisorInsertInput,
  EventSupervisorOnConflict,
  EventSupervisorSetInput,
  EventSupervisorBoolExp,
  EventSupervisorOrderBy,
  EventSupervisorSelectColumn,
  EventSupervisorPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertEventSupervisorArgsType = {
  objects: Array<EventSupervisorInsertInput>;
  onConflict?: EventSupervisorOnConflict;
};

export type InsertOneEventSupervisorArgsType = {
  object: EventSupervisorInsertInput;
  onConflict?: EventSupervisorOnConflict;
};

export type UpdateEventSupervisorArgsType = {
  where: EventSupervisorBoolExp;
  _set: EventSupervisorSetInput;
};

export type DeleteEventSupervisorArgsType = {
  where: EventSupervisorBoolExp;
};

export type DeleteByPkEventSupervisorArgsType = {
  id: string;
};

export type UpdateByPkEventSupervisorArgsType = {
  pkColumns: EventSupervisorPkColumnsInput;
  _set: EventSupervisorSetInput;
};

export type FindEventSupervisorArgsType = {
  where: EventSupervisorBoolExp;
  orderBy?: Array<EventSupervisorOrderBy>;
  distinctOn?: Array<EventSupervisorSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventSupervisorArgsType = {
  id: string;
};

export type AggregateEventSupervisorArgsType = {
  where: EventSupervisorBoolExp;
  orderBy?: Array<EventSupervisorOrderBy>;
  distinctOn?: Array<EventSupervisorSelectColumn>;
  limit?: number;
  offset?: number;
};
