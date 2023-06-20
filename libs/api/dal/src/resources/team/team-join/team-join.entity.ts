import { TeamJoinRepository } from './team-join.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { ApprovalState } from '@okampus/shared/enums';

import type { FormSubmission } from '../../form-submission/form-submission.entity';
import type { Pole } from '../pole/pole.entity';
import type { Role } from '../role/role.entity';
import type { Team } from '../team.entity';
import type { TeamJoinOptions } from './team-join.options';
import type { User } from '../../individual/user/user.entity';
import type { Individual } from '../../individual/individual.entity';

@Entity({ customRepository: () => TeamJoinRepository })
export class TeamJoin extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamJoinRepository;

  @Enum({ items: () => ApprovalState, type: EnumType, default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  @ManyToOne({ type: 'User' })
  joiner!: User;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  settledBy: Individual | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  settledAt: Date | null = null;

  @ManyToOne({ type: 'FormSubmission', nullable: true, default: null })
  formSubmission: FormSubmission | null = null;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'Role' })
  askedRole!: Role;

  @ManyToOne({ type: 'Role', nullable: true, default: null })
  receivedRole: Role | null = null;

  @ManyToOne({ type: 'Pole', nullable: true, default: null })
  receivedPole: Pole | null = null;

  constructor(options: TeamJoinOptions) {
    super(options);
    this.assign(options);
  }
}
