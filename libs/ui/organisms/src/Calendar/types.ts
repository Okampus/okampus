export type EventType = {
  id: string;
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
