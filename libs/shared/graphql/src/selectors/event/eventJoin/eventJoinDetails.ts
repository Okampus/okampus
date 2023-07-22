import { eventJoinMinimalInfo } from './eventJoinMinimal';
import { Selector } from '../../../zeus';
import { individualBaseInfo } from '../../individual/individualBase';

import { formSubmissionBaseInfo } from '../../formSubmission/formSubmissionBase';
import { individualWithUserInfo } from '../../individual/individualWithUser';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventJoinDetailsInfo = Selector('EventJoin')({
  ...eventJoinMinimalInfo,
  formSubmission: formSubmissionBaseInfo,
  processedBy: individualBaseInfo,
  processedAt: true,
  participationProcessedVia: true,
  participationProcessedAt: true,
  participationProcessedBy: individualWithUserInfo,
  isPresent: true,
  state: true,
});
export type EventJoinDetailsInfo = InputType<GraphQLTypes['EventJoin'], typeof eventJoinDetailsInfo>;
