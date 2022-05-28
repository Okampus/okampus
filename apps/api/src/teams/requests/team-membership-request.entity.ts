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
import { Team } from '../teams/team.entity';
import { MembershipRequestIssuer } from '../types/membership-request-issuer.enum';
import { MembershipRequestState } from '../types/membership-request-state.enum';

@Entity()
export class TeamMembershipRequest extends BaseEntity {
  @PrimaryKey()
  teamMembershipRequestId!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  team!: Team;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

  @Property({ type: 'text' })
  message?: string;

  @Property({ type: 'json', nullable: true })
  meta?: object;

  @Enum(() => MembershipRequestIssuer)
  issuer!: MembershipRequestIssuer;

  @Enum(() => MembershipRequestState)
  @Index()
  state = MembershipRequestState.Pending;

  @Enum(() => TeamRole)
  role = TeamRole.Member;

  @ManyToOne({ onDelete: 'CASCADE' })
  handledBy?: User;

  @Property()
  handledAt?: Date;

  @ManyToOne({ onDelete: 'CASCADE' })
  issuedBy!: User;

  constructor(options: {
    team: Team;
    user: User;
    issuer: MembershipRequestIssuer;
    issuedBy: User;
    meta?: object;
    message?: string;
    role?: TeamRole;
  }) {
    super();
    this.team = options.team;
    this.user = options.user;
    this.issuer = options.issuer;
    this.issuedBy = options.issuedBy;

    if (options.meta)
      this.meta = options.meta;
    if (options.message)
      this.message = options.message;
    if (options.role)
      this.role = options.role;
  }
}
