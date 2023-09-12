import { ProjectRepository } from './project.repository';
import { TenantScopedHiddableEntity } from '../..';
import { TransformCollection } from '@okampus/api/shards';
import {
  Collection,
  Entity,
  EntityRepositoryType,
  Enum,
  EnumType,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';

import { Colors, ProjectType } from '@okampus/shared/enums';

import type { ProjectOptions } from './project.options';
import type { EventOrganize } from '../../event/event-organize/event-organize.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { Team } from '../../team/team.entity';
import type { Grant } from '../../team/grant/grant.entity';
import type { Mission } from '../../team/mission/mission.entity';
import type { TeamMember } from '../../team/team-member/team-member.entity';

@Entity({ customRepository: () => ProjectRepository })
export class Project extends TenantScopedHiddableEntity {
  [EntityRepositoryType]?: ProjectRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', default: '' })
  description = '';

  @Property({ type: 'text' })
  slug!: string;

  @Enum({ items: () => Colors, type: EnumType, default: Colors.Blue })
  color: Colors = Colors.Blue;

  @Enum({ items: () => ProjectType, type: EnumType, default: ProjectType.Other })
  type: ProjectType = ProjectType.Other;

  @Property({ type: 'text', default: '' })
  regularEventInterval = '';

  @Property({ type: Date, nullable: true, default: null })
  start: Date | null = null;

  @Property({ type: Date, nullable: true, default: null })
  end: Date | null = null;

  @Property({ type: 'float', default: 0 })
  budget = 0;

  @Property({ type: 'boolean', default: false })
  isPrivate = false;

  @Property({ type: 'boolean', default: false })
  isTemplate = false;

  @ManyToMany({ type: 'TeamMember' })
  @TransformCollection()
  supervisors = new Collection<TeamMember>(this);

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  banner: FileUpload | null = null;

  @ManyToOne({ type: 'Grant', nullable: true, default: null })
  grant: Grant | null = null;

  @OneToMany({ type: 'EventOrganize', mappedBy: 'project' })
  @TransformCollection()
  eventOrganizes = new Collection<EventOrganize>(this);

  @OneToMany({ type: 'Mission', mappedBy: 'project' })
  @TransformCollection()
  missions = new Collection<Mission>(this);

  constructor(options: ProjectOptions) {
    super(options);
    this.assign(options);
  }
}
