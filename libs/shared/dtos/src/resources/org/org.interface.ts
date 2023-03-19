import type { OrgKind } from '@okampus/shared/enums';
import type { IActor } from '../actor/actor.interface';
import type { ITenantEvent } from '../content-master/event/event.interface';
import type { IOrgDocument } from '../manage-org/org-document/org-document.interface';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { OrgProps } from './org.props';

export type IOrg = ITenantScoped &
  OrgProps & {
    orgKind: OrgKind;
    actor?: IActor;
    parent?: IOrg | null;
    events?: ITenantEvent[];
    documents: IOrgDocument[];
  };
