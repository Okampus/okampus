import { tenantBaseInfo } from './tenantBase';
import { Selector } from '../../zeus';

import type { GraphQLTypes, InputType } from '../../zeus';

// TODO: change Tenant documents approach
export const tenantWithDocumentsInfo = Selector('Tenant')({
  ...tenantBaseInfo,
});
export type TenantWithDocumentsInfo = InputType<GraphQLTypes['Tenant'], typeof tenantWithDocumentsInfo>;
