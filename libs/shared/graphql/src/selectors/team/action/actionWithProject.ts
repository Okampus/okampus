import { actionBaseInfo } from './actionBase';
import { Selector } from '../../../zeus';

import { projectBaseInfo } from '../../project/projectBase';
import type { GraphQLTypes, InputType } from '../../../zeus';

export const actionWithProjectInfo = Selector('Action')({
  ...actionBaseInfo,
  project: projectBaseInfo,
});
export type ActionWithProjectInfo = InputType<GraphQLTypes['Action'], typeof actionWithProjectInfo>;
