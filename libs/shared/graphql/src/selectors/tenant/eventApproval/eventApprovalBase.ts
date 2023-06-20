import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { eventApprovalStepBaseInfo } from '../eventApprovalStep/eventApprovalStepBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventApprovalBaseInfo = Selector('EventApproval')({
  ...entityBase,
  eventApprovalStep: eventApprovalStepBaseInfo,
  approved: true,
  message: true,
});
export type EventApprovalBaseInfo = InputType<GraphQLTypes['EventApproval'], typeof eventApprovalBaseInfo>;
