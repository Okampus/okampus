import { eventJoinMinimalInfo } from './eventJoinMinimal';
import { Selector } from '../../../zeus';
import { individualBaseInfo } from '../../individual/individualBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventJoinBaseInfo = Selector('EventJoin')({
  ...eventJoinMinimalInfo,
  processedBy: individualBaseInfo,
  processedAt: true,
  participationProcessedVia: true,
  participationProcessedAt: true,
  participationProcessedBy: individualBaseInfo,
  isParticipant: true,
  state: true,
});
export type EventJoinBaseInfo = InputType<GraphQLTypes['EventJoin'], typeof eventJoinBaseInfo>;
