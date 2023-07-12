import { eventBaseInfo } from './eventBase';
import { eventApprovalBaseInfo } from '../tenant/eventApproval/eventApprovalBase';
import { eventApprovalStepBaseInfo } from '../tenant/eventApprovalStep/eventApprovalStepBase';
import { Selector } from '../../zeus';

import type { GraphQLTypes, InputType } from '../../zeus';

export const eventManageBaseInfo = Selector('Event')({
  ...eventBaseInfo,
  eventApprovals: [{}, eventApprovalBaseInfo],
  lastEventApprovalStep: eventApprovalStepBaseInfo,
});
export type EventManageBaseInfo = InputType<GraphQLTypes['Event'], typeof eventManageBaseInfo>;
