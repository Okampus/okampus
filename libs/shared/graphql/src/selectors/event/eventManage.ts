import { eventDetailsInfo } from './eventDetails';
import { eventJoinDetailsInfo } from './eventJoin/eventJoinDetails';
import { formSubmissionBaseInfo } from '../formSubmission/formSubmissionBase';
import { eventApprovalBaseInfo } from '../tenant/eventApproval/eventApprovalBase';
import { eventApprovalStepBaseInfo } from '../tenant/eventApprovalStep/eventApprovalStepBase';

import { OrderBy, Selector } from '../../zeus';

import type { GraphQLTypes, InputType } from '../../zeus';

export const eventManageInfo = Selector('Event')({
  ...eventDetailsInfo,
  eventApprovals: [{}, eventApprovalBaseInfo],
  nextEventApprovalStep: eventApprovalStepBaseInfo,
  eventJoins: [{ orderBy: [{ participationProcessedAt: OrderBy.DESC }] }, eventJoinDetailsInfo],
  eventApprovalSubmission: formSubmissionBaseInfo,
});
export type EventManageInfo = InputType<GraphQLTypes['Event'], typeof eventManageInfo>;
