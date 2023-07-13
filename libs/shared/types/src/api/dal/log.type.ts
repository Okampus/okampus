import type { JSON } from '../../types/json.type';

// TODO: add more types (date, float vs. int, distinguish some common rel, etc.)
export enum DiffType {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Json = 'Json',
  Rel = 'Rel',
}

export type Diff = {
  before: JSON;
  after: JSON;
  type: DiffType;
  relType?: string;
};

export type LogDiff = {
  [key: string]: Diff;
};
