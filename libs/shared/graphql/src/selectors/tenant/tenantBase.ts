import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const tenantBaseInfo = Selector('Tenant')({ ...entityBase, name: true, pointName: true });
export type TenantBaseInfo = InputType<GraphQLTypes['Tenant'], typeof tenantBaseInfo>;
