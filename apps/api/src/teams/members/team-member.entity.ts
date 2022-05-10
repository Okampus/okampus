import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Expose } from 'class-transformer';
import { TEAMMEMBER_TEAM_INCLUDED } from '../../shared/lib/constants';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';
import { User } from '../../users/user.entity';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Team } from '../teams/team.entity';

@Entity()
export class TeamMember extends BaseEntity {
  @PrimaryKey()
  teamMemberId!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @ManyToOne('Team', { onDelete: 'CASCADE' })
  @Expose({ groups: [TEAMMEMBER_TEAM_INCLUDED] })
  @Index()
  team!: Team;

  @Enum(() => TeamRole)
  role!: TeamRole;

  @Property()
  roleLabel?: string;

  @Property()
  joinDate = new Date();

  constructor(options: {
    user: User;
    team: Team;
    role: TeamRole;
    roleLabel?: string;
  }) {
    super();
    this.user = options.user;
    this.team = options.team;
    this.role = options.role;
    this.roleLabel = options.roleLabel;
  }
}
