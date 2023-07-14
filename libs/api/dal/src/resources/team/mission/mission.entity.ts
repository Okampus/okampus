import { MissionRepository } from './mission.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import {
  Entity,
  Property,
  Enum,
  ManyToOne,
  EnumType,
  EntityRepositoryType,
  OneToMany,
  Collection,
} from '@mikro-orm/core';

import { TransformCollection } from '@okampus/api/shards';
import { Colors } from '@okampus/shared/enums';

import type { MissionOptions } from './mission.options';
import type { Team } from '../team.entity';
import type { MissionJoin } from '../mission-join/mission-join.entity';
import type { EventOrganize } from '../../event/event-organize/event-organize.entity';
import type { Project } from '../../project/project.entity';

@Entity({ customRepository: () => MissionRepository })
export class Mission extends TenantScopedEntity {
  [EntityRepositoryType]!: MissionRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', default: '' })
  description = '';

  @Property({ type: 'smallint' })
  pointsMinimum!: number;

  @Property({ type: 'smallint' })
  pointsMaximum!: number;

  @Property({ type: 'smallint', default: 1 })
  quantity = 1;

  @Property({ type: 'boolean', default: false })
  isAutoAcceptingMembers = false;

  @Property({ type: 'boolean', default: false })
  isTemplate = false;

  @Enum({ items: () => Colors, type: EnumType, default: Colors.Blue })
  color = Colors.Blue;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'EventOrganize', nullable: true, default: null })
  eventManage: EventOrganize | null = null;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  project: Project | null = null;

  @OneToMany({ type: 'MissionJoin', mappedBy: 'mission' })
  @TransformCollection()
  missionJoins = new Collection<MissionJoin>(this);

  constructor(options: MissionOptions) {
    super(options);
    this.assign(options);
  }
}
