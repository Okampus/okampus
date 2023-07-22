import { individualBaseInfo } from './individualBase';
import { userMinimalInfo } from './userMinimal';
import { Selector } from '../../zeus';
import type { InputType, GraphQLTypes } from '../../zeus';

export const individualWithUserInfo = Selector('Individual')({
  ...individualBaseInfo,
  user: userMinimalInfo,
});
export type IndividualWithUserInfo = InputType<GraphQLTypes['Individual'], typeof individualWithUserInfo>;
