import { eventApprovalStepBaseInfo } from '../eventApprovalStep/eventApprovalStepBase';
import { entityBase } from '../../entityBase';
import { Selector } from '../../../zeus';

import { individualWithUserInfo } from '../../individual/individualWithUser';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventApprovalBaseInfo = Selector('EventApproval')({
  ...entityBase,
  eventApprovalStep: eventApprovalStepBaseInfo,
  isApproved: true,
  createdBy: individualWithUserInfo,
  message: true,
});
export type EventApprovalBaseInfo = InputType<GraphQLTypes['EventApproval'], typeof eventApprovalBaseInfo>;
