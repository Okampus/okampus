import { Selector } from '../../../zeus';
import { entityBase } from '../../entityBase';
import { campusClusterBaseInfo } from '../campusCluster/campusClusterBase';
import { teamBaseInfo } from '../../team/teamBase';

import type { InputType, GraphQLTypes } from '../../../zeus';

export const tenantOrganizeBaseInfo = Selector('TenantOrganize')({
  ...entityBase,
  campusCluster: campusClusterBaseInfo,
  team: teamBaseInfo,
});
export type TenantOrganizeBaseInfo = InputType<GraphQLTypes['TenantOrganize'], typeof tenantOrganizeBaseInfo>;
