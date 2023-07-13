import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const campusBaseInfo = Selector('Campus')({
  ...entityBase,
});
export type CampusBaseInfo = InputType<GraphQLTypes['Campus'], typeof campusBaseInfo>;
