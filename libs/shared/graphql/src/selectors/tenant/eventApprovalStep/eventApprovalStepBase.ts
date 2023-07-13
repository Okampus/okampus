import { eventApprovalStepMinimalInfo } from './eventApprovalStepMinimal';
import { Selector } from '../../../zeus';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventApprovalStepBaseInfo = Selector('EventApprovalStep')({
  ...eventApprovalStepMinimalInfo,
  name: true,
  description: true,
  order: true,
  nextSteps: [{}, eventApprovalStepMinimalInfo],
  previousStep: eventApprovalStepMinimalInfo,
});
export type EventApprovalStepBaseInfo = InputType<GraphQLTypes['EventApprovalStep'], typeof eventApprovalStepBaseInfo>;
