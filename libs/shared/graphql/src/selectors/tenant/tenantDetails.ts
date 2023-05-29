import { tenantBaseInfo } from './tenantBase';
import { eventApprovalStepDetailsInfo } from './eventApprovalStep/eventApprovalStepDetails';
import { actorAddressBaseInfo } from '../actor/actorAddress/actorAddressBase';
import { Selector } from '../../zeus';
import { teamBaseInfo } from '../team/teamBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantDetailsInfo = Selector('Tenant')({
  ...tenantBaseInfo,
  team: teamBaseInfo,
  campuses: [{}, { id: true, name: true, actorAddress: actorAddressBaseInfo }],
  eventApprovalSteps: [{}, eventApprovalStepDetailsInfo],
});
export type TenantDetailsInfo = InputType<GraphQLTypes['Tenant'], typeof tenantDetailsInfo>;
