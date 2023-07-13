import { eventManageMinimalInfo } from './eventManageMinimal';
import { eventBaseInfo } from '../eventBase';
import { Selector } from '../../../zeus';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventManageBaseInfo = Selector('EventManage')({
  ...eventManageMinimalInfo,
  event: eventBaseInfo,
});
export type EventManageBaseInfo = InputType<GraphQLTypes['EventManage'], typeof eventManageBaseInfo>;
