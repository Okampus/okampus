import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventApprovalStepMinimalInfo = Selector('EventApprovalStep')({
  ...entityBase,
  name: true,
  description: true,
  order: true,
});
export type EventApprovalStepMinimalInfo = InputType<
  GraphQLTypes['EventApprovalStep'],
  typeof eventApprovalStepMinimalInfo
>;
