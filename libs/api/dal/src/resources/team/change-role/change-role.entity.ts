import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core';

import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { TeamJoin } from '../team-join/team-join.entity';
import type { Role } from '../role/role.entity';
import type { Team } from '../team.entity';
import type { ChangeRoleOptions } from './change-role.options';

@Entity()
export class ChangeRole extends TenantScopedEntity {
  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'UserInfo' })
  user!: UserInfo;

  @OneToOne({ type: 'TeamJoin', mappedBy: 'changeRole', nullable: true })
  teamJoin: TeamJoin | null = null;

  @ManyToOne({ type: 'Role', nullable: true, default: null })
  receivedRole: Role | null = null;

  @ManyToOne({ type: 'Pole', nullable: true, default: null })
  receivedPole: Role | null = null;

  @Property({ type: 'text' })
  note = '';

  constructor(options: ChangeRoleOptions) {
    super(options);
    this.assign(options);
  }
}
