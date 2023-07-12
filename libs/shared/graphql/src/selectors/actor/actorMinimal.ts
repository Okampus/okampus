import { actorImageBaseInfo } from './actorImage/actorImageBase';
import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const actorMinimalInfo = Selector('Actor')({
  ...entityBase,
  name: true,
  slug: true,
  website: true,
  actorImages: [{ where: { lastActiveDate: { _isNull: true } } }, actorImageBaseInfo],
});
export type ActorMinimalInfo = InputType<GraphQLTypes['Actor'], typeof actorMinimalInfo>;
