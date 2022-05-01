import {
  Entity,
  Enum,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/lib/entities/base.entity';
import { User } from '../../users/user.entity';
import { MembershipRequestIssuer } from '../membership-request-issuer.enum';
import { MembershipRequestState } from '../membership-request-state.enum';
import { Team } from './team.entity';

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

  @Enum(() => MembershipRequestIssuer)
  issuer!: MembershipRequestIssuer;

  @Enum(() => MembershipRequestState)
  state = MembershipRequestState.Pending;

  @ManyToOne({ onDelete: 'CASCADE' })
  handledBy?: User;

  @Property()
  handledAt?: Date;

  @ManyToOne({ onDelete: 'CASCADE' })
  issuedBy!: User;

  constructor(options: {
    team: Team;
    user: User;
    message?: string;
    issuer: MembershipRequestIssuer;
    issuedBy: User;
  }) {
    super();
    this.team = options.team;
    this.user = options.user;
    this.message = options.message;
    this.issuer = options.issuer;
    this.issuedBy = options.issuedBy;
  }
}
