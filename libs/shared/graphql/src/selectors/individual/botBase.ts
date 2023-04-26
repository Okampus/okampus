import { individualBaseInfo } from './individualBase';
import { actorBaseInfo } from '../actor/actorBase';
import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { InputType, GraphQLTypes } from '../../zeus';

export const botBaseInfo = Selector('BotInfo')({
  ...entityBase,
  deletedAt: true,
  actor: actorBaseInfo,
  individual: individualBaseInfo,
});
export type BotBaseInfo = InputType<GraphQLTypes['BotInfo'], typeof botBaseInfo>;
