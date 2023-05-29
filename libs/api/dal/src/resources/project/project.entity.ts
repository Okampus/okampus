import { ProjectRepository } from './project.repository';
import { TenantScopedEntity } from '..';
import { TransformCollection } from '@okampus/api/shards';
import {
  Cascade,
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';

import type { ProjectRole } from './project-role/project-role.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { Team } from '../team/team.entity';
import type { Event } from '../event/event.entity';
import type { TeamMember } from '../team/team-member/team-member.entity';
import type { ProjectOptions } from './project.options';
import type { Tag } from '../actor/tag/tag.entity';

@Entity({ customRepository: () => ProjectRepository })
export class Project extends TenantScopedEntity {
  [EntityRepositoryType]?: ProjectRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true, default: null })
  description: string | null = null;

  @Property({ type: 'text' })
  slug!: string;

  @Property({ type: 'float' })
  expectedBudget!: number;

  @Property({ type: 'float', default: 0 })
  actualBudget = 0;

  @Property({ type: 'boolean' })
  isPrivate = false;

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null, cascade: [Cascade.ALL] })
  image: FileUpload | null = null;

  @ManyToMany({ type: 'TeamMember' })
  @TransformCollection()
  supervisors = new Collection<TeamMember>(this);

  @OneToMany({ type: 'ProjectRole', mappedBy: 'project' })
  @TransformCollection()
  roles = new Collection<ProjectRole>(this);

  @OneToMany({ type: 'Event', mappedBy: 'project' })
  @TransformCollection()
  events = new Collection<Event>(this);

  constructor(options: ProjectOptions) {
    super(options);
    this.assign(options);
  }
}
