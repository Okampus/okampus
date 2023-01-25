import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Team } from '../../org/team/team.entity';
import { TeamMember } from '../../membership/team-member/team-member.entity';
import { Individual } from '../../actor/individual/individual.entity';
import { User } from '../../actor/user/user.entity';
import { TenantEvent } from '../../content-master/event/event.entity';
import { ProjectOptions } from './project.options';

@Entity()
export class Project extends TenantScopedEntity {
  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'TeamMember' })
  teamMember!: TeamMember;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @ManyToOne({ type: 'TenantEvent', nullable: true })
  linkedEvent: TenantEvent | null = null;

  @Property({ type: 'int' })
  expectedBudget!: number;

  @Property({ type: 'int', nullable: true })
  actualBudget: number | null = null;

  @ManyToOne({ type: 'Individual' })
  createdBy!: Individual;

  @ManyToOne({ type: 'User' })
  supervisor!: User;

  constructor(options: ProjectOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
