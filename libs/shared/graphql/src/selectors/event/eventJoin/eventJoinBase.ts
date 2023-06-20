import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { userBaseInfo } from '../../individual/userBase';
import { individualBaseInfo } from '../../individual/individualBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventJoinBaseInfo = Selector('EventJoin')({
  ...entityBase,
  joiner: userBaseInfo,
  settledBy: individualBaseInfo,
  settledAt: true,
  presenceSettledVia: true,
  presenceSettledAt: true,
  presenceSettledBy: individualBaseInfo,
  presence: true,
  state: true,
});
export type EventJoinBaseInfo = InputType<GraphQLTypes['EventJoin'], typeof eventJoinBaseInfo>;
