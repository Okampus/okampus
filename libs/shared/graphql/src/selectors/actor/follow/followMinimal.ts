import { Selector } from '../../../zeus';
import { actorBaseInfo } from '../actorBase';
import { entityBase } from '../../entityBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const followMinimalInfo = Selector('Follow')({ ...entityBase, actor: actorBaseInfo });
export type FollowMinimalInfo = InputType<GraphQLTypes['Follow'], typeof followMinimalInfo>;
