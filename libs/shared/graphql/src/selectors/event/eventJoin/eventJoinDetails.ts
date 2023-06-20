import { eventJoinBaseInfo } from './eventJoinBase';
import { eventBaseInfo } from '../eventBase';
import { actionBaseInfo } from '../../team/action/actionBase';
import { Selector } from '../../../zeus';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventJoinDetailsInfo = Selector('EventJoin')({
  ...eventJoinBaseInfo,
  actions: [{}, actionBaseInfo],
  event: eventBaseInfo,
});
export type EventJoinDetailsInfo = InputType<GraphQLTypes['EventJoin'], typeof eventJoinDetailsInfo>;
