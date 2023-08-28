import type { User } from '../user/user.entity';
import type { Team } from '../team/team.entity';
import type { TenantScopedOptions } from '../tenant-scoped.options';
import type { LegalUnit } from './legal-unit/legal-unit.entity';
import type { Tag } from './tag/tag.entity';
import type { ActorProps } from './actor.props';

export type ActorOptions = ActorProps &
  TenantScopedOptions & {
    tags?: Tag[];
    user?: User | null;
    team?: Team | null;
    legalUnit?: LegalUnit | null;
  };
