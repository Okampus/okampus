import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import { actorMinimalInfo } from '../actor/actorMinimal';

import type { GraphQLTypes, InputType } from '../../zeus';

export const teamMinimalInfo = Selector('Team')({ ...entityBase, type: true, actor: actorMinimalInfo });
export type TeamMinimalInfo = InputType<GraphQLTypes['Team'], typeof teamMinimalInfo>;
