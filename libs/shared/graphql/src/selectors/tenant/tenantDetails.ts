import { tenantBaseInfo } from './tenantBase';
import { eventApprovalStepDetailsInfo } from './eventApprovalStep/eventApprovalStepDetails';
import { addressBaseInfo } from '../actor/address/addressBase';
import { Selector } from '../../zeus';

import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantDetailsInfo = Selector('Tenant')({
  ...tenantBaseInfo,
  campuses: [{}, { id: true, name: true, address: addressBaseInfo }],
  eventApprovalSteps: [{}, eventApprovalStepDetailsInfo],
});
export type TenantDetailsInfo = InputType<GraphQLTypes['Tenant'], typeof tenantDetailsInfo>;
