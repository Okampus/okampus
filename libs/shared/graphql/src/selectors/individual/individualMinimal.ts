import { userMinimalInfo } from './userMinimal';
import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import { actorMinimalInfo } from '../actor/actorMinimal';
import type { InputType, GraphQLTypes } from '../../zeus';

export const individualMinimalInfo = Selector('Individual')({
  ...entityBase,
  actor: actorMinimalInfo,
  user: userMinimalInfo,
});
export type IndividualMinimalInfo = InputType<GraphQLTypes['Individual'], typeof individualMinimalInfo>;
