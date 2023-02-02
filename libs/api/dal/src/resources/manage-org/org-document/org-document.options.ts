import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { OrgDocumentProps } from '@okampus/shared/dtos';
import { Org } from '../../org/org.entity';
import { TenantDocument } from '../../ugc/document/document.entity';

export type OrgDocumentOptions = OrgDocumentProps &
  TenantScopedOptions & {
    org: Org;
    document: TenantDocument;
  };
