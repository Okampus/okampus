import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const contentBaseInfo = Selector('Content')({
  ...entityBase,
  text: true,
});
export type ContentBaseInfo = InputType<GraphQLTypes['Content'], typeof contentBaseInfo>;
