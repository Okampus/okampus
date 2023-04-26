import { eventBaseInfo } from './eventBase';
import { eventRoleBaseInfo } from './eventRole/eventRoleBase';
import { Selector } from '../../zeus';
import { ApprovalState } from '@okampus/shared/enums';
import type { GraphQLTypes, InputType } from '../../zeus';

export const eventDetailsInfo = Selector('Event')({
  ...eventBaseInfo,
  eventRoles: [{}, eventRoleBaseInfo],
  eventJoinsAggregate: [
    { where: { state: { _eq: ApprovalState.Approved } } },
    {
      aggregate: {
        count: [{}, true],
      },
    },
  ],
});
export type EventDetailsInfo = InputType<GraphQLTypes['Event'], typeof eventDetailsInfo>;
