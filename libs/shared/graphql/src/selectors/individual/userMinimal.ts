import { Selector } from '../../zeus';

import { entityBase } from '../entityBase';
import { actorImageBaseInfo } from '../actor/actorImage/actorImageBase';
import type { InputType, GraphQLTypes } from '../../zeus';

export const userMinimalInfo = Selector('User')({
  ...entityBase,
  individualById: {
    actor: { actorImages: [{ where: { lastActiveDate: { _isNull: true } } }, actorImageBaseInfo], name: true },
  },
});
export type UserMinimalInfo = InputType<GraphQLTypes['User'], typeof userMinimalInfo>;
