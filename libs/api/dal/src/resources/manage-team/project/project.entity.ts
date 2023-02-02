import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Collection, Entity, ManyToMany, ManyToOne, Property } from '@mikro-orm/core';
import { Team } from '../../org/team/team.entity';
import { Individual } from '../../actor/individual/individual.entity';
import { User } from '../../actor/user/user.entity';
import { TenantEvent } from '../../content-master/event/event.entity';
import { ProjectOptions } from './project.options';
import { TransformCollection } from '@okampus/api/shards';
// eslint-disable-next-line import/no-cycle
import { ProjectRepository } from './project.repository';

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
