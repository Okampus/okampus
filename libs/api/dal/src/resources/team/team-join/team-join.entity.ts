import { TeamJoinRepository } from './team-join.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, OneToOne } from '@mikro-orm/core';
import { ApprovalState } from '@okampus/shared/enums';

import type { ChangeRole } from '../change-role/change-role.entity';
import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { FormSubmission } from '../../form-submission/form-submission.entity';
import type { Role } from '../role/role.entity';
import type { Team } from '../team.entity';
import type { TeamJoinOptions } from './team-join.options';

@Entity({ customRepository: () => TeamJoinRepository })
export class TeamJoin extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamJoinRepository;

  @Enum({ items: () => ApprovalState, type: EnumType, default: ApprovalState.Pending })
  state = ApprovalState.Pending;

  @ManyToOne({ type: 'UserInfo' })
  joiner!: UserInfo;

  @ManyToOne({ type: 'FormSubmission', nullable: true, default: null })
  formSubmission: FormSubmission | null = null;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'Role' })
  askedRole!: Role;

  @OneToOne({ type: 'ChangeRole', inversedBy: 'teamJoin', nullable: true })
  changeRole: ChangeRole | null = null;

  constructor(options: TeamJoinOptions) {
    super(options);
    this.assign(options);
  }
}
