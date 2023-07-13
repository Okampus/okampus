import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantBaseInfo = Selector('Tenant')({ ...entityBase, pointName: true });
export type TenantBaseInfo = InputType<GraphQLTypes['Tenant'], typeof tenantBaseInfo>;
