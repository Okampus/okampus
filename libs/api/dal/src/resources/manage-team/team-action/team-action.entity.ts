import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { ApprovalState } from '@okampus/shared/enums';
import type { Team } from '../../org/team/team.entity';
import type { TeamMember } from '../../membership/team-member/team-member.entity';
import type { Individual } from '../../actor/individual/individual.entity';
import type { User } from '../../actor/user/user.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { TeamActionOptions } from './team-action.options';
import type { Project } from '../project/project.entity';

@Entity()
export class TeamAction extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Enum({ items: () => ApprovalState, type: 'string' })
  state!: ApprovalState;

  @Property({ type: 'int' })
  score = 0;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'User' })
  user!: User;

  // Membership of the user; if null, the user is a guest participant
  @ManyToOne({ type: 'TeamMember', nullable: true })
  teamMember: TeamMember | null = null;

  @ManyToOne({ type: 'TenantEvent', nullable: true })
  linkedEvent: TenantEvent | null = null;

  @ManyToOne({ type: 'Project', nullable: true })
  linkedProject: Project | null = null;

  @ManyToOne({ type: 'Individual' })
  createdBy!: Individual;

  @ManyToOne({ type: 'TeamMember', nullable: true })
  validatedBy!: TeamMember | null;

  constructor(options: TeamActionOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
