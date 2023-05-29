import { ActionRepository } from './action.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Property, Enum, ManyToOne, EnumType, EntityRepositoryType } from '@mikro-orm/core';
import { ApprovalState } from '@okampus/shared/enums';

import type { ActionOptions } from './action.options';
import type { Individual } from '../../individual/individual.entity';
import type { EventJoin } from '../../event/event-join/event-join.entity';
import type { Event } from '../../event/event.entity';
import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { Project } from '../../project/project.entity';
import type { Team } from '../team.entity';

@Entity({ customRepository: () => ActionRepository })
export class Action extends TenantScopedEntity {
  [EntityRepositoryType]!: ActionRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true, default: null })
  description: string | null = null;

  @Enum({ items: () => ApprovalState, type: EnumType })
  state!: ApprovalState;

  @Property({ type: 'int', default: 0 })
  score!: number;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'Event', nullable: true, default: null })
  event: Event | null = null;

  @ManyToOne({ type: 'UserInfo' })
  user!: UserInfo;

  @ManyToOne({ type: 'EventJoin', inversedBy: 'action', nullable: true, default: null })
  eventJoin: EventJoin | null = null;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  project: Project | null = null;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  validatedBy!: Individual | null;

  constructor(options: ActionOptions) {
    super(options);
    this.assign(options);
  }
}
