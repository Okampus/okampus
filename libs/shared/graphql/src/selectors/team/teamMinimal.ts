import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import { actorImageBaseInfo } from '../actor/actorImage/actorImageBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const teamMinimalInfo = Selector('Team')({
  ...entityBase,
  actor: {
    actorImages: [{ where: { lastActiveDate: { _isNull: true } } }, actorImageBaseInfo],
    name: true,
  },
});
export type TeamMinimalInfo = InputType<GraphQLTypes['Team'], typeof teamMinimalInfo>;
