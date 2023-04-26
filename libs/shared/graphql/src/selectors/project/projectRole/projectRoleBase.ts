import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const projectRoleBaseInfo = Selector('ProjectRole')({
  ...entityBase,
  autoAccept: true,
  color: true,
  description: true,
  name: true,
  rewardMaximum: true,
  rewardMinimum: true,
});
export type ProjectRoleBaseInfo = InputType<GraphQLTypes['ProjectRole'], typeof projectRoleBaseInfo>;
