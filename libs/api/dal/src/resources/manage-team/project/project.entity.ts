import { ProjectRepository } from './project.repository';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import type { Team } from '../../org/team/team.entity';
import type { User } from '../../actor/user/user.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { ProjectOptions } from './project.options';
import type { ProjectRole } from '../../role/project-role/project-role.entity';
import type { TeamMember } from '../../membership/team-member/team-member.entity';

@Entity({ customRepository: () => ProjectRepository })
export class Project extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Property({ type: 'float' })
  expectedBudget!: number;

  @Property({ type: 'float', nullable: true })
  actualBudget: number | null = null;

  @Property({ type: 'boolean' })
  isPrivate = false;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToMany({ type: 'TenantEvent' })
  @TransformCollection()
  linkedEvents = new Collection<TenantEvent>(this);

  @ManyToMany({ type: 'TeamMember' })
  @TransformCollection()
  supervisors = new Collection<TeamMember>(this);

  @OneToMany({ type: 'ProjectRole', mappedBy: 'project' })
  @TransformCollection()
  roles = new Collection<ProjectRole>(this);

  @ManyToMany({ type: 'User' })
  @TransformCollection()
  participants = new Collection<User>(this);

  constructor(options: ProjectOptions) {
    super({ tenant: options.tenant, createdBy: options.createdBy });
    this.assign(options);
  }
}
