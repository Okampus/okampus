import { eventBaseInfo } from './eventBase';
import { eventJoinWithEventInfo } from './eventJoin/eventJoinWithEvent';
import { formBaseInfo } from '../form/formBase';
import { Selector } from '../../zeus';

import { ApprovalState } from '@okampus/shared/enums';

import type { GraphQLTypes, InputType } from '../../zeus';

export const eventWithJoinDetailsInfo = Selector('Event')({
  ...eventBaseInfo,
  eventJoins: [{ where: { state: { _eq: ApprovalState.Approved } } }, eventJoinWithEventInfo],
  joinForm: formBaseInfo,
});
export type EventWithJoinDetailsInfo = InputType<GraphQLTypes['Event'], typeof eventWithJoinDetailsInfo>;
