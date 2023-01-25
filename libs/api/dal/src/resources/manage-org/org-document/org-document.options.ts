import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { OrgDocumentProps } from '@okampus/shared/dtos';

export type OrgDocumentOptions = OrgDocumentProps & TenantScopedOptions;
