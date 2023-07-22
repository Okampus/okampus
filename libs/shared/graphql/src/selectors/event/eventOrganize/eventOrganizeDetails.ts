import { eventOrganizeMinimalInfo } from './eventOrganizeMinimal';
import { Selector } from '../../../zeus';

import { eventManageInfo } from '../eventManage';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventOrganizeDetailsInfo = Selector('EventOrganize')({
  ...eventOrganizeMinimalInfo,
  event: eventManageInfo,
});
export type EventOrganizeDetailsInfo = InputType<GraphQLTypes['EventOrganize'], typeof eventOrganizeDetailsInfo>;
