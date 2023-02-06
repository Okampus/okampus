import { ProjectRepository } from './project.repository';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { TransformCollection } from '@okampus/api/shards';
import type { Team } from '../../org/team/team.entity';
import type { Individual } from '../../actor/individual/individual.entity';
import type { User } from '../../actor/user/user.entity';
import type { TenantEvent } from '../../content-master/event/event.entity';
import type { ProjectOptions } from './project.options';


@Entity({
  customRepository: () => ProjectRepository,
})
export class Project extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @Property({ type: 'int' })
  expectedBudget!: number;

  @Property({ type: 'int', nullable: true })
  actualBudget: number | null = null;

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'TenantEvent', nullable: true })
  linkedEvent: TenantEvent | null = null;

  @ManyToOne({ type: 'Individual' })
  createdBy!: Individual;

  @ManyToOne({ type: 'User' })
  supervisor!: User;

  @ManyToMany({ type: 'User' })
  @TransformCollection()
  participants = new Collection<User>(this);

  constructor(options: ProjectOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
