import { OrgKind } from '@okampus/shared/enums';
import type { IActor } from '../actor/actor.interface';
import { ITenantScopedEntity } from '../tenant-scoped.interface';
import { OrgProps } from './org.props';

export type IOrg = ITenantScopedEntity &
  OrgProps & {
    actor?: IActor;
    orgKind: OrgKind;
    parent?: IOrg | null;
  };
