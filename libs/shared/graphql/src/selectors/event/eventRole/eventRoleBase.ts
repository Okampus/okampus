import { Selector } from '../../../zeus';
import { userBaseInfo } from '../../individual/userBase';

import { projectRoleBaseInfo } from '../../project/projectRole/projectRoleBase';
import { eventBaseInfo } from '../eventBase';
import { entityBase } from '../../entityBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const eventRoleBaseInfo = Selector('EventRole')({
  ...entityBase,
  autoAccept: true,
  color: true,
  description: true,
  rewardMaximum: true,
  rewardMinimum: true,
  userInfo: userBaseInfo,
  name: true,
  projectRole: projectRoleBaseInfo,
  event: eventBaseInfo,
});
export type EventRoleBaseInfo = InputType<GraphQLTypes['EventRole'], typeof eventRoleBaseInfo>;
