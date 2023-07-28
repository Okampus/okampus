import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import { teamMinimalInfo } from '../team/teamMinimal';
import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantOidcInfo = Selector('Tenant')({
  ...entityBase,
  adminTeam: teamMinimalInfo,
  isOidcEnabled: true,
  oidcName: true,
});
export type TenantOidcInfo = InputType<GraphQLTypes['Tenant'], typeof tenantOidcInfo>;
