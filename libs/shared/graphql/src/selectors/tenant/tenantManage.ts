import { tenantOrganizeBaseInfo } from './tenantOrganize/tenantOrganizeBase';
import { tenantDetailsInfo } from './tenantDetails';
import { teamManageInfo } from '../team/teamManage';
import { Selector } from '../../zeus';
import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantManageInfo = Selector('Tenant')({
  ...tenantDetailsInfo,
  adminTeam: teamManageInfo,
  tenantOrganizes: [{}, tenantOrganizeBaseInfo],
});
export type TenantOrganizeInfo = InputType<GraphQLTypes['Tenant'], typeof tenantManageInfo>;
