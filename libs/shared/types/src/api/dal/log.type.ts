import type { JSON } from '../../types/json.type';

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
};

export type LogDiff = {
  [key: string]: Diff;
};
