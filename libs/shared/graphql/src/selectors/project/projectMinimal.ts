import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const projectMinimalInfo = Selector('Project')({
  ...entityBase,
  name: true,
  slug: true,
  color: true,
  isPrivate: true,
});
export type ProjectMinimalInfo = InputType<GraphQLTypes['Project'], typeof projectMinimalInfo>;
