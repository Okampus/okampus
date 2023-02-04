import type { IOrg } from '../../org/org.interface';
import type { ITenantScoped } from '../../tenant-scoped.interface';
import type { ITenantDocument } from '../../ugc/document/document.interface';
import type { OrgDocumentProps } from './org-document.props';

export type IOrgDocument = ITenantScoped &
  OrgDocumentProps & {
    org?: IOrg;
    document?: ITenantDocument;
  };
