import { actorBaseInfo } from './actorBase';
import { teamBaseInfo } from '../team/teamBase';
import { Selector } from '../../zeus';

import type { InputType, GraphQLTypes } from '../../zeus';

export const actorWithTeamInfo = Selector('Actor')({
  ...actorBaseInfo,
  team: teamBaseInfo,
});
export type ActorWithTeamInfo = InputType<GraphQLTypes['Actor'], typeof actorWithTeamInfo>;
