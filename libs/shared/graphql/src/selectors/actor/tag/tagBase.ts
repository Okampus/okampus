import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import type { InputType, GraphQLTypes } from '../../../zeus';

export const tagBaseInfo = Selector('Tag')({
  ...entityBase,
  slug: true,
  name: true,
  color: true,
});
export type TagBaseInfo = InputType<GraphQLTypes['Tag'], typeof tagBaseInfo>;
