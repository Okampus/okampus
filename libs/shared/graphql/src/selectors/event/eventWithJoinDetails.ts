import { eventBaseInfo } from './eventBase';
import { eventJoinDetailsInfo } from './eventJoin/eventJoinDetails';
import { formBaseInfo } from '../form/formBase';
import { Selector } from '../../zeus';

import { ApprovalState } from '@okampus/shared/enums';

import type { GraphQLTypes, InputType } from '../../zeus';

export const eventWithJoinDetailsInfo = Selector('Event')({
  ...eventBaseInfo,
  eventJoins: [{ where: { state: { _eq: ApprovalState.Approved } } }, eventJoinDetailsInfo],
  form: formBaseInfo,
});
export type EventWithJoinDetailsInfo = InputType<GraphQLTypes['Event'], typeof eventWithJoinDetailsInfo>;
