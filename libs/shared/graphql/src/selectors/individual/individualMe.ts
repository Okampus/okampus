import { individualBaseInfo } from './individualBase';
import { Selector } from '../../zeus';
import { followMinimalInfo } from '../actor/follow/followMinimal';
import type { InputType, GraphQLTypes } from '../../zeus';

export const individualMeInfo = Selector('Individual')({ ...individualBaseInfo, following: [{}, followMinimalInfo] });
export type IndividualMeInfo = InputType<GraphQLTypes['Individual'], typeof individualMeInfo>;
