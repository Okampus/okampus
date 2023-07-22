import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import { actorMinimalInfo } from '../actor/actorMinimal';

import type { InputType, GraphQLTypes } from '../../zeus';

export const userMinimalInfo = Selector('User')({
  ...entityBase,
  firstName: true,
  lastName: true,
  tenantId: true,
  individual: { ...entityBase, actor: actorMinimalInfo },
});
export type UserMinimalInfo = InputType<GraphQLTypes['User'], typeof userMinimalInfo>;
