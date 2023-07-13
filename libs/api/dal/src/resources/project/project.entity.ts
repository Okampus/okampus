import { ProjectRepository } from './project.repository';
import { TenantScopedEntity } from '..';
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

import { Colors } from '@okampus/shared/enums';

import type { EventManage } from '../event/event-manage/event-manage.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { Grant } from '../team/grant/grant.entity';
import type { Mission } from '../team/mission/mission.entity';
import type { Tag } from '../actor/tag/tag.entity';
import type { Team } from '../team/team.entity';
import type { TeamMember } from '../team/team-member/team-member.entity';
import type { ProjectOptions } from './project.options';

@Entity({ customRepository: () => ProjectRepository })
export class Project extends TenantScopedEntity {
  [EntityRepositoryType]?: ProjectRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', default: '' })
  description = '';

  @Property({ type: 'text' })
  slug!: string;

  @Enum({ items: () => Colors, type: EnumType, default: Colors.Blue })
  color: Colors = Colors.Blue;

  @Property({ type: 'float', default: 0 })
  budget = 0;

  @Property({ type: 'text', default: '' })
  regularEventInterval = '';

  @Property({ type: 'boolean', default: false })
  isPrivate = false;

  @Property({ type: 'boolean', default: false })
  isTemplate = false;

  @ManyToMany({ type: 'Tag' })
  @TransformCollection()
  tags = new Collection<Tag>(this);

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'FileUpload', nullable: true, default: null })
  banner: FileUpload | null = null;

  @ManyToOne({ type: 'Grant', nullable: true, default: null })
  grant: Grant | null = null;

  @ManyToMany({ type: 'TeamMember' })
  @TransformCollection()
  supervisors = new Collection<TeamMember>(this);

  @OneToMany({ type: 'EventManage', mappedBy: 'project' })
  @TransformCollection()
  eventManages = new Collection<EventManage>(this);

  @OneToMany({ type: 'Mission', mappedBy: 'project' })
  @TransformCollection()
  missions = new Collection<Mission>(this);

  constructor(options: ProjectOptions) {
    super(options);
    this.assign(options);
  }
}
