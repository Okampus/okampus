import type {
  EventApprovalStepInsertInput,
  EventApprovalStepOnConflict,
  EventApprovalStepSetInput,
  EventApprovalStepBoolExp,
  EventApprovalStepOrderBy,
  EventApprovalStepSelectColumn,
  EventApprovalStepPkColumnsInput,
} from '@okampus/shared/graphql';

export type InsertEventApprovalStepArgsType = {
  objects: Array<EventApprovalStepInsertInput>;
  onConflict?: EventApprovalStepOnConflict;
};

export type InsertOneEventApprovalStepArgsType = {
  object: EventApprovalStepInsertInput;
  onConflict?: EventApprovalStepOnConflict;
};

export type UpdateEventApprovalStepArgsType = {
  where: EventApprovalStepBoolExp;
  _set: EventApprovalStepSetInput;
};

export type DeleteEventApprovalStepArgsType = {
  where: EventApprovalStepBoolExp;
};

export type UpdateByPkEventApprovalStepArgsType = {
  pkColumns: EventApprovalStepPkColumnsInput;
  _set: EventApprovalStepSetInput;
};

export type FindEventApprovalStepArgsType = {
  where: EventApprovalStepBoolExp;
  orderBy?: Array<EventApprovalStepOrderBy>;
  distinctOn?: Array<EventApprovalStepSelectColumn>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventApprovalStepArgsType = {
  id: string;
};

export type AggregateEventApprovalStepArgsType = {
  where: EventApprovalStepBoolExp;
  orderBy?: Array<EventApprovalStepOrderBy>;
  distinctOn?: Array<EventApprovalStepSelectColumn>;
  limit?: number;
  offset?: number;
};
