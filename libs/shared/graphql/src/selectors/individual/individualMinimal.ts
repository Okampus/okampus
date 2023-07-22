import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import { actorBaseInfo } from '../actor/actorBase';
import type { InputType, GraphQLTypes } from '../../zeus';

export const individualMinimalInfo = Selector('Individual')({
  ...entityBase,
  actor: actorBaseInfo,
});
export type IndividualMinimalInfo = InputType<GraphQLTypes['Individual'], typeof individualMinimalInfo>;
