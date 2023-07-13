import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { campusClusterBaseInfo } from '../campusCluster/campusClusterBase';
import { teamBaseInfo } from '../../team/teamBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const tenantManageBaseInfo = Selector('TenantManage')({
  ...entityBase,
  campusCluster: campusClusterBaseInfo,
  team: teamBaseInfo,
});
export type TenantManageBaseInfo = InputType<GraphQLTypes['TenantManage'], typeof tenantManageBaseInfo>;
