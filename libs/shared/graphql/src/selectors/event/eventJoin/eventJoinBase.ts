import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { userBaseInfo } from '../../individual/userBase';
import { individualBaseInfo } from '../../individual/individualBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventJoinBaseInfo = Selector('EventJoin')({
  ...entityBase,
  joinedBy: userBaseInfo,
  processedBy: individualBaseInfo,
  processedAt: true,
  participationProcessedVia: true,
  participationProcessedAt: true,
  participationProcessedBy: individualBaseInfo,
  isParticipant: true,
  state: true,
});
export type EventJoinBaseInfo = InputType<GraphQLTypes['EventJoin'], typeof eventJoinBaseInfo>;
