import { eventManageMinimalInfo } from './eventManageMinimal';
import { Selector } from '../../../zeus';

import { eventManageInfo } from '../eventManage';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventManageDetailsInfo = Selector('EventManage')({
  ...eventManageMinimalInfo,
  event: eventManageInfo,
});
export type EventManageDetailsInfo = InputType<GraphQLTypes['EventManage'], typeof eventManageDetailsInfo>;
