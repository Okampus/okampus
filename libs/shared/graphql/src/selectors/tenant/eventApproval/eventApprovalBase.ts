import { eventApprovalStepBaseInfo } from '../eventApprovalStep/eventApprovalStepBase';
import { entityBase } from '../../entityBase';
import { individualMinimalInfo } from '../../individual/individualMinimal';
import { Selector } from '../../../zeus';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventApprovalBaseInfo = Selector('EventApproval')({
  ...entityBase,
  eventApprovalStep: eventApprovalStepBaseInfo,
  isApproved: true,
  createdBy: individualMinimalInfo,
  message: true,
});
export type EventApprovalBaseInfo = InputType<GraphQLTypes['EventApproval'], typeof eventApprovalBaseInfo>;
