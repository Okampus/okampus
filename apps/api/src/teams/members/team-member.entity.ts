import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { TeamRole } from '../../shared/lib/types/enums/team-role.enum';
import { User } from '../../users/user.entity';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Team } from '../teams/team.entity';

@Entity()
export class TeamMember extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @ManyToOne({ onDelete: 'CASCADE' })
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
