import type { ValueTypes } from '@okampus/shared/graphql';

export type InsertEventApprovalStepArgsType = {
  objects: Array<ValueTypes['EventApprovalStepInsertInput']>;
  onConflict?: ValueTypes['EventApprovalStepOnConflict'];
};

export type InsertOneEventApprovalStepArgsType = {
  object: ValueTypes['EventApprovalStepInsertInput'];
  onConflict?: ValueTypes['EventApprovalStepOnConflict'];
};

export type UpdateEventApprovalStepArgsType = {
  where: ValueTypes['EventApprovalStepBoolExp'];
  _set: ValueTypes['EventApprovalStepSetInput'];
};

export type UpdateByPkEventApprovalStepArgsType = {
  pkColumns: ValueTypes['EventApprovalStepPkColumnsInput'];
  _set: ValueTypes['EventApprovalStepSetInput'];
};

export type FindEventApprovalStepArgsType = {
  where: ValueTypes['EventApprovalStepBoolExp'];
  orderBy?: Array<ValueTypes['EventApprovalStepOrderBy']>;
  distinctOn?: Array<ValueTypes['EventApprovalStepSelectColumn']>;
  limit?: number;
  offset?: number;
};

export type FindByPkEventApprovalStepArgsType = {
  id: string;
};

export type AggregateEventApprovalStepArgsType = {
  where: ValueTypes['EventApprovalStepBoolExp'];
  orderBy?: Array<ValueTypes['EventApprovalStepOrderBy']>;
  distinctOn?: Array<ValueTypes['EventApprovalStepSelectColumn']>;
  limit?: number;
  offset?: number;
};
