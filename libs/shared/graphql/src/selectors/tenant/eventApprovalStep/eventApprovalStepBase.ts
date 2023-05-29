import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventApprovalStepBaseInfo = Selector('EventApprovalStep')({
  ...entityBase,
  name: true,
  description: true,
});
export type EventApprovalStepBaseInfo = InputType<GraphQLTypes['EventApprovalStep'], typeof eventApprovalStepBaseInfo>;
