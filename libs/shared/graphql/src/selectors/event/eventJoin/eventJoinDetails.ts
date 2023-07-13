import { eventJoinMinimalInfo } from './eventJoinMinimal';
import { Selector } from '../../../zeus';
import { individualBaseInfo } from '../../individual/individualBase';

import { formSubmissionBaseInfo } from '../../formSubmission/formSubmissionBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventJoinDetailsInfo = Selector('EventJoin')({
  ...eventJoinMinimalInfo,
  formSubmission: formSubmissionBaseInfo,
  processedBy: individualBaseInfo,
  processedAt: true,
  participationProcessedVia: true,
  participationProcessedAt: true,
  participationProcessedBy: individualBaseInfo,
  isPresent: true,
  state: true,
});
export type EventJoinDetailsInfo = InputType<GraphQLTypes['EventJoin'], typeof eventJoinDetailsInfo>;
