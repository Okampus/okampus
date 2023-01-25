import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, Property } from '@mikro-orm/core';
import { TeamCategoryOptions } from './team-category.options';

@Entity()
export class TeamCategory extends TenantScopedEntity {
  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  constructor(options: TeamCategoryOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
