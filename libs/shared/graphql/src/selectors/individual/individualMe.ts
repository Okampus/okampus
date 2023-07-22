import { individualMinimalInfo } from './individualMinimal';
import { Selector } from '../../zeus';
import { followMinimalInfo } from '../actor/follow/followMinimal';
import type { InputType, GraphQLTypes } from '../../zeus';

export const individualMeInfo = Selector('Individual')({
  ...individualMinimalInfo,
  following: [{}, followMinimalInfo],
});
export type IndividualMeInfo = InputType<GraphQLTypes['Individual'], typeof individualMeInfo>;
