import type {
  EventApprovalInsertInput,
  EventApprovalOnConflict,
  EventApprovalSetInput,
  EventApprovalBoolExp,
  EventApprovalOrderBy,
  EventApprovalSelectColumn,
  EventApprovalPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertEventApprovalArgsType = {
  objects: Array<EventApprovalInsertInput>;
  onConflict?: EventApprovalOnConflict;
};

export type InsertOneEventApprovalArgsType = {
  object: EventApprovalInsertInput;
  onConflict?: EventApprovalOnConflict;
};

export type UpdateEventApprovalArgsType = {
  where: EventApprovalBoolExp;
  _set: EventApprovalSetInput;
};

export type DeleteEventApprovalArgsType = {
  where: EventApprovalBoolExp;
};

export type UpdateByPkEventApprovalArgsType = {
  pkColumns: EventApprovalPkColumnsInput;
  _set: EventApprovalSetInput;
};

export type FindEventApprovalArgsType = {
  where: EventApprovalBoolExp;
  orderBy?: Array<EventApprovalOrderBy>;
  distinctOn?: Array<EventApprovalSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventApprovalArgsType = {
  id: string;
};

export type AggregateEventApprovalArgsType = {
  where: EventApprovalBoolExp;
  orderBy?: Array<EventApprovalOrderBy>;
  distinctOn?: Array<EventApprovalSelectColumn>;
  limit?: number;
  offset?: number;
};
