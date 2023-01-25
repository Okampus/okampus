import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, EntityRepositoryType, Enum, Property } from '@mikro-orm/core';
import { Colors } from '@okampus/shared/enums';
import { TagOptions } from './tag.options';
// eslint-disable-next-line import/no-cycle
import { TagRepository } from './tag.repository';

@Entity({ customRepository: () => TagRepository })
export class Tag extends TenantScopedEntity {
  [EntityRepositoryType]!: TagRepository;

  @Property({ type: 'text' })
  name!: string;

  @Enum(() => Colors)
  color!: Colors;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  constructor(options: TagOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
