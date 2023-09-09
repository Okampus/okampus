import type {
  EventApprovalValidatorInsertInput,
  EventApprovalValidatorOnConflict,
  EventApprovalValidatorSetInput,
  EventApprovalValidatorBoolExp,
  EventApprovalValidatorOrderBy,
  EventApprovalValidatorSelectColumn,
  EventApprovalValidatorPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertEventApprovalValidatorArgsType = {
  objects: Array<EventApprovalValidatorInsertInput>;
  onConflict?: EventApprovalValidatorOnConflict;
};

export type InsertOneEventApprovalValidatorArgsType = {
  object: EventApprovalValidatorInsertInput;
  onConflict?: EventApprovalValidatorOnConflict;
};

export type UpdateEventApprovalValidatorArgsType = {
  where: EventApprovalValidatorBoolExp;
  _set: EventApprovalValidatorSetInput;
};

export type DeleteEventApprovalValidatorArgsType = {
  where: EventApprovalValidatorBoolExp;
};

export type DeleteByPkEventApprovalValidatorArgsType = {
  id: string;
};

export type UpdateByPkEventApprovalValidatorArgsType = {
  pkColumns: EventApprovalValidatorPkColumnsInput;
  _set: EventApprovalValidatorSetInput;
};

export type FindEventApprovalValidatorArgsType = {
  where: EventApprovalValidatorBoolExp;
  orderBy?: Array<EventApprovalValidatorOrderBy>;
  distinctOn?: Array<EventApprovalValidatorSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventApprovalValidatorArgsType = {
  id: string;
};

export type AggregateEventApprovalValidatorArgsType = {
  where: EventApprovalValidatorBoolExp;
  orderBy?: Array<EventApprovalValidatorOrderBy>;
  distinctOn?: Array<EventApprovalValidatorSelectColumn>;
  limit?: number;
  offset?: number;
};
