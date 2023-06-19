import { ActionRepository } from './action.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Property, Enum, ManyToOne, EnumType, EntityRepositoryType } from '@mikro-orm/core';
import { ApprovalState } from '@okampus/shared/enums';

import type { ActionOptions } from './action.options';
import type { Individual } from '../../individual/individual.entity';
import type { EventJoin } from '../../event/event-join/event-join.entity';
import type { UserInfo } from '../../individual/user-info/user-info.entity';
import type { Project } from '../../project/project.entity';
import type { Team } from '../team.entity';

@Entity({ customRepository: () => ActionRepository })
export class Action extends TenantScopedEntity {
  [EntityRepositoryType]!: ActionRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', default: '' })
  description = '';

  @Property({ type: 'smallint', nullable: true, default: null })
  points: number | null = null;

  @Enum({ items: () => ApprovalState, type: EnumType })
  state: ApprovalState = ApprovalState.Pending;

  @ManyToOne({ type: 'Individual', nullable: true, default: null })
  settledBy: Individual | null = null;

  @Property({ type: 'Date', nullable: true, default: null })
  settledAt: Date | null = null;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'UserInfo' })
  user!: UserInfo;

  @ManyToOne({ type: 'EventJoin', nullable: true, default: null })
  eventJoin: EventJoin | null = null;

  @ManyToOne({ type: 'Project', nullable: true, default: null })
  project: Project | null = null;

  constructor(options: ActionOptions) {
    super(options);
    this.assign(options);
  }
}
