import { eventApprovalStepBaseInfo } from './eventApprovalStepBase';
import { Selector } from '../../../zeus';
import { individualBaseInfo } from '../../individual/individualBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventApprovalStepDetailsInfo = Selector('EventApprovalStep')({
  ...eventApprovalStepBaseInfo,
  previousStep: eventApprovalStepBaseInfo,
  nextSteps: [{}, eventApprovalStepBaseInfo],
  eventApprovalStepNotifiees: [{}, { individual: individualBaseInfo }],
  eventApprovalStepValidators: [{}, { individual: individualBaseInfo }],
});
export type EventApprovalStepDetailsInfo = InputType<
  GraphQLTypes['EventApprovalStep'],
  typeof eventApprovalStepDetailsInfo
>;
