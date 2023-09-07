import { TeamJoinRepository } from './team-join.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { ApprovalState } from '@okampus/shared/enums';

import type { TeamJoinOptions } from './team-join.options';
import type { Team } from '../team.entity';
import type { FormSubmission } from '../../form/form-submission/form-submission.entity';
import type { User } from '../../user/user.entity';

@Entity({ customRepository: () => TeamJoinRepository })
export class TeamJoin extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamJoinRepository;

  @Enum({ items: () => ApprovalState, type: EnumType, default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  @ManyToOne({ type: 'User' })
  joinedBy!: User;

  @ManyToOne({ type: 'User', nullable: true, default: null })
  processedBy: User | null = null;

  @Property({ type: 'datetime', nullable: true, default: null })
  processedAt: Date | null = null;

  @ManyToOne({ type: 'FormSubmission', nullable: true, default: null })
  formSubmission: FormSubmission | null = null;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  constructor(options: TeamJoinOptions) {
    super(options);
    this.assign(options);
  }
}
