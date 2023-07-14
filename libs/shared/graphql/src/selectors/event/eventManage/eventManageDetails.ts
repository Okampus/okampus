import { eventManageMinimalInfo } from './eventManageMinimal';
import { Selector } from '../../../zeus';

import { eventManageInfo } from '../eventManage';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventManageDetailsInfo = Selector('EventOrganize')({
  ...eventManageMinimalInfo,
  event: eventManageInfo,
});
export type EventOrganizeDetailsInfo = InputType<GraphQLTypes['EventOrganize'], typeof eventManageDetailsInfo>;
