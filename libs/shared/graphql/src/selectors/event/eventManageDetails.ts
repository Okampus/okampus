import { eventManageBaseInfo } from './eventManageBase';
import { eventJoinDetailsInfo } from './eventJoin/eventJoinDetails';
import { Selector } from '../../zeus';
import { userBaseInfo } from '../individual/userBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const eventManageDetailsInfo = Selector('Event')({
  ...eventManageBaseInfo,
  user: userBaseInfo,
  eventJoins: [{}, eventJoinDetailsInfo],
});
export type EventManageDetailsInfo = InputType<GraphQLTypes['Event'], typeof eventManageDetailsInfo>;
