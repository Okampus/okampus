import { tenantManageBaseInfo } from './tenantManage/tenantManageBase';
import { tenantDetailsInfo } from './tenantDetails';
import { teamManageInfo } from '../team/teamManage';
import { Selector } from '../../zeus';
import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantManageInfo = Selector('Tenant')({
  ...tenantDetailsInfo,
  adminTeam: teamManageInfo,
  tenantManages: [{}, tenantManageBaseInfo],
});
export type TenantManageInfo = InputType<GraphQLTypes['Tenant'], typeof tenantManageInfo>;
