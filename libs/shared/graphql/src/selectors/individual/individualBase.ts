import { userMinimalInfo } from './userMinimal';
import { Selector } from '../../zeus';
import { actorBaseInfo } from '../actor/actorBase';
import { entityBase } from '../entityBase';
import type { InputType, GraphQLTypes } from '../../zeus';

export const individualBaseInfo = Selector('Individual')({
  ...entityBase,
  actor: actorBaseInfo,
  user: userMinimalInfo,
});
export type IndividualBaseInfo = InputType<GraphQLTypes['Individual'], typeof individualBaseInfo>;
