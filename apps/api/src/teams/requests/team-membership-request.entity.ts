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
import type { TeamForm } from '../forms/team-form.entity';
import { Team } from '../teams/team.entity';
import { MembershipRequestIssuer } from '../types/membership-request-issuer.enum';
import { MembershipRequestState } from '../types/membership-request-state.enum';

@Entity()
export class TeamMembershipRequest extends BaseEntity {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  team!: Team;

  @ManyToOne({ onDelete: 'CASCADE' })
  @Index()
  user!: User;

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

  @Property({ type: 'text' })
  handledMessage?: string;

  @ManyToOne({ onDelete: 'CASCADE' })
  issuedBy!: User;

  @ManyToOne()
  originalForm?: TeamForm | null;

  @Property({ type: 'json' })
  formSubmission?: object | null;

  constructor(options: {
    team: Team;
    user: User;
    issuer: MembershipRequestIssuer;
    issuedBy: User;
    originalForm?: TeamForm | null;
    formSubmission?: object | null;
    meta?: object;
    handledMessage?: string;
    role?: TeamRole;
  }) {
    super();
    this.team = options.team;
    this.user = options.user;
    this.issuer = options.issuer;
    this.issuedBy = options.issuedBy;

    if (options.originalForm)
      this.originalForm = options.originalForm;
    if (options.formSubmission)
      this.formSubmission = options.formSubmission;
    if (options.meta)
      this.meta = options.meta;
    if (options.handledMessage)
      this.handledMessage = options.handledMessage;
    if (options.role)
      this.role = options.role;
  }
}
