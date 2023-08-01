import { projectBaseInfo } from './projectBase';
import { Selector } from '../../zeus';
import { eventOrganizeDetailsInfo } from '../event/eventOrganize/eventOrganizeDetails';
import type { InputType, GraphQLTypes } from '../../zeus';

export const projectDetailsInfo = Selector('Project')({
  ...projectBaseInfo,
  eventOrganizes: [{ limit: 2 }, eventOrganizeDetailsInfo],
});
export type ProjectDetailsInfo = InputType<GraphQLTypes['Project'], typeof projectDetailsInfo>;
