import { tenantBaseInfo } from './tenantBase';
import { eventApprovalStepDetailsInfo } from './eventApprovalStep/eventApprovalStepDetails';
import { Selector } from '../../zeus';
import { teamBaseInfo } from '../team/teamBase';

import { locationBaseInfo } from '../actor/location/locationBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantDetailsInfo = Selector('Tenant')({
  ...tenantBaseInfo,
  eventApprovalSteps: [{}, eventApprovalStepDetailsInfo],
  campusClusters: [{}, { campuses: [{}, { __typename: true, id: true, name: true, location: locationBaseInfo }] }],
  tenantManages: [{}, { campusCluster: { __typename: true, id: true }, team: teamBaseInfo }],
});
export type TenantDetailsInfo = InputType<GraphQLTypes['Tenant'], typeof tenantDetailsInfo>;
