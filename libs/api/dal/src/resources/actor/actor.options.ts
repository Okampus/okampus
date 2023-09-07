import type { ActorProps } from './actor.props';
import type { TenantScopableOptions } from '../tenant-scoped.entity';
import type { User } from '../user/user.entity';
import type { Team } from '../team/team.entity';
import type { Tenant } from '../tenant/tenant.entity';
import type { LegalUnit } from './legal-unit/legal-unit.entity';
import type { LegalUnitLocation } from './legal-unit-location/legal-unit-location.entity';

export type ActorOptions = ActorProps &
  TenantScopableOptions & {
    user?: User;
    team?: Team;
    tenant?: Tenant;
    legalUnit?: LegalUnit;
    legalUnitLocation?: LegalUnitLocation;
  };
