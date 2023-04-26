import { projectBaseInfo } from './projectBase';
import { Selector } from '../../zeus';
import { eventDetailsInfo } from '../event/eventDetails';

import type { InputType, GraphQLTypes } from '../../zeus';

export const projectDetailsInfo = Selector('Project')({
  ...projectBaseInfo,
  events: [{}, eventDetailsInfo],
});
export type ProjectDetailsInfo = InputType<GraphQLTypes['Project'], typeof projectDetailsInfo>;
