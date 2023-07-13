import { eventJoinDetailsInfo } from './eventJoinDetails';
import { eventBaseInfo } from '../eventBase';
import { actionBaseInfo } from '../../team/action/actionBase';
import { Selector } from '../../../zeus';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventJoinWithEventInfo = Selector('EventJoin')({
  ...eventJoinDetailsInfo,
  actions: [{}, actionBaseInfo],
  event: eventBaseInfo,
});
export type EventJoinWithEventInfo = InputType<GraphQLTypes['EventJoin'], typeof eventJoinWithEventInfo>;
