import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import { teamBaseInfo } from '../team/teamBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantBaseInfo = Selector('Tenant')({
  ...entityBase,
  name: true,
  pointName: true,
  adminTeam: teamBaseInfo,
});
export type TenantBaseInfo = InputType<GraphQLTypes['Tenant'], typeof tenantBaseInfo>;
