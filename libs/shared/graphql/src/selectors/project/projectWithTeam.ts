import { projectDetailsInfo } from './projectDetails';
import { Selector } from '../../zeus';
import { teamBaseInfo } from '../team/teamBase';
import type { InputType, GraphQLTypes } from '../../zeus';

export const projectWithTeamInfo = Selector('Project')({
  ...projectDetailsInfo,
  team: teamBaseInfo,
});
export type ProjectWithTeamInfo = InputType<GraphQLTypes['Project'], typeof projectWithTeamInfo>;
