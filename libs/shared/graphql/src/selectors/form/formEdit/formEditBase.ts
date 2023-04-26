import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const formEditBaseInfo = Selector('FormEdit')({
  ...entityBase,
  newVersion: [{}, true],
});
export type FormEditBaseInfo = InputType<GraphQLTypes['FormEdit'], typeof formEditBaseInfo>;
