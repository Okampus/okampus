import { eventBaseInfo } from './eventBase';
import { eventJoinDetailsInfo } from './eventJoin/eventJoinDetails';
import { Selector } from '../../zeus';
import { formBaseInfo } from '../form/formBase';

import { ApprovalState } from '@okampus/shared/enums';
import type { GraphQLTypes, InputType } from '../../zeus';

export const eventDetailsInfo = Selector('Event')({
  ...eventBaseInfo,
  joinForm: formBaseInfo,
  eventJoins: [{ where: { state: { _eq: ApprovalState.Approved } }, limit: 10 }, eventJoinDetailsInfo],
});
export type EventDetailsInfo = InputType<GraphQLTypes['Event'], typeof eventDetailsInfo>;
