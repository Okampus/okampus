import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import { individualBaseInfo } from '../individual/individualBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const logBaseInfo = Selector('Log')({
  ...entityBase,
  createdBy: individualBaseInfo,
  diff: true,
  note: true,
  entityName: true,
  eventType: true,
  entityId: true,
  context: true,
});
export type LogBaseInfo = InputType<GraphQLTypes['Log'], typeof logBaseInfo>;
