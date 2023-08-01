import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import { individualMinimalInfo } from '../individual/individualMinimal';
import { userMinimalInfo } from '../individual/userMinimal';

import type { InputType, GraphQLTypes } from '../../zeus';

export const logBaseInfo = Selector('Log')({
  ...entityBase,
  createdBy: { ...individualMinimalInfo, user: userMinimalInfo },
  diff: true,
  note: true,
  entityName: true,
  eventType: true,
  entityId: true,
  context: true,
});
export type LogBaseInfo = InputType<GraphQLTypes['Log'], typeof logBaseInfo>;
