import { OrgKind } from '@okampus/shared/enums';
import type { IActor } from '../actor/actor.interface';
import { IOrgDocument } from '../manage-org/org-document/org-document.interface';
import { ITenantScoped } from '../tenant-scoped.interface';
import { OrgProps } from './org.props';

export type IOrg = ITenantScoped &
  OrgProps & {
    orgKind: OrgKind;
    actor?: IActor;
    parent?: IOrg | null;
    documents: IOrgDocument[];
  };
