import type { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import type { OrgDocumentProps } from '@okampus/shared/dtos';
import type { Org } from '../../org/org.entity';
import type { TenantDocument } from '../../ugc/document/document.entity';

export type OrgDocumentOptions = OrgDocumentProps &
  TenantScopedOptions & {
    org: Org;
    document: TenantDocument;
  };
