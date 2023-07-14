import { tenantBaseInfo } from './tenantBase';
import { eventApprovalStepDetailsInfo } from './eventApprovalStep/eventApprovalStepDetails';
import { campusClusterBaseInfo } from './campusCluster/campusClusterBase';
import { formBaseInfo } from '../form/formBase';
import { teamBaseInfo } from '../team/teamBase';
import { Selector } from '../../zeus';

import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantDetailsInfo = Selector('Tenant')({
  ...tenantBaseInfo,
  eventValidationForm: formBaseInfo,
  eventApprovalSteps: [{}, eventApprovalStepDetailsInfo],
  campusClusters: [{}, campusClusterBaseInfo],
  tenantOrganizes: [{}, { campusCluster: campusClusterBaseInfo, team: teamBaseInfo }],
  adminTeam: teamBaseInfo,
});
export type TenantDetailsInfo = InputType<GraphQLTypes['Tenant'], typeof tenantDetailsInfo>;
