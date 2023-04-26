import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import type { GraphQLTypes, InputType } from '../../../zeus';

export const roleBaseInfo = Selector('Role')({
  ...entityBase,
  category: true,
  type: true,
  name: true,
  permissions: true,
});
export type RoleBaseInfo = InputType<GraphQLTypes['Role'], typeof roleBaseInfo>;
