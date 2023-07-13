import { eventBaseInfo } from './eventBase';
import { eventJoinMinimalInfo } from './eventJoin/eventJoinMinimal';
import { formBaseInfo } from '../form/formBase';
import { Selector } from '../../zeus';

import { ApprovalState } from '@okampus/shared/enums';

import type { GraphQLTypes, InputType } from '../../zeus';

export const eventWithJoinInfo = Selector('Event')({
  ...eventBaseInfo,
  eventJoins: [{ where: { state: { _eq: ApprovalState.Approved } }, limit: 3 }, eventJoinMinimalInfo],
  joinForm: formBaseInfo,
});
export type EventWithJoinInfo = InputType<GraphQLTypes['Event'], typeof eventWithJoinInfo>;
