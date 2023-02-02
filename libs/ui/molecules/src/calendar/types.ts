import { Snowflake } from '@okampus/shared/types';

export type EventType = {
  id: Snowflake;
  label: string;
  day: number;
  title: string;
  description: string;
};

export type Label = {
  checked: boolean;
  label: string;
};

export type ReduceOperation = 'push' | 'update' | 'delete';

export type ReduceEvent = {
  type: ReduceOperation;
  payload: EventType;
};
