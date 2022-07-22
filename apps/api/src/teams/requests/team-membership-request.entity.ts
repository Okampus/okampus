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
  meta: object | null = null;

  @Enum(() => MembershipRequestIssuer)
  issuer!: MembershipRequestIssuer;

  @Enum(() => MembershipRequestState)
  @Index()
  state = MembershipRequestState.Pending;

  @Enum(() => TeamRole)
  role = TeamRole.Member;

  @ManyToOne({ onDelete: 'CASCADE' })
  handledBy: User | null = null;

  @Property()
  handledAt: Date | null = null;

  @Property({ type: 'text' })
  handledMessage: string | null = null;

  @ManyToOne({ onDelete: 'CASCADE' })
  issuedBy!: User;

  @ManyToOne()
  originalForm: TeamForm | null = null;

  @Property({ type: 'json' })
  formSubmission: object | null = null;

  constructor(options: {
    team: Team;
    user: User;
    issuer: MembershipRequestIssuer;
    issuedBy: User;
    originalForm?: TeamForm | null;
    formSubmission?: object | null;
    meta?: object | null;
    handledMessage?: string | null;
    role?: TeamRole | null;
  }) {
    super();
    this.assign(options);
  }
}
