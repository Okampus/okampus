import { Selector } from '../../../zeus';
import { actorBaseInfo } from '../actorBase';
import { entityBase } from '../../entityBase';
import { individualBaseInfo } from '../../individual/individualBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const followBaseInfo = Selector('Follow')({
  ...entityBase,
  actor: actorBaseInfo,
  createdBy: individualBaseInfo,
});
export type FollowBaseInfo = InputType<GraphQLTypes['Follow'], typeof followBaseInfo>;
