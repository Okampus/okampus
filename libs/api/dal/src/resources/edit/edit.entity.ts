import { TenantScopedEntity } from '../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import { EditKind } from '@okampus/shared/enums';

import type { EditOptions } from './edit.options';
import type { Ugc } from '../ugc/ugc.entity';
import type { JSONObject } from '@okampus/shared/types';

@Entity()
export class Edit extends TenantScopedEntity {
  @Enum({ items: () => EditKind, type: 'string' })
  editKind!: EditKind;

  @Property({ type: 'json', nullable: true })
  addedDiff: JSONObject | null = null;

  @ManyToOne({ type: 'Ugc', onDelete: 'CASCADE' })
  linkedUgc!: Ugc;

  constructor(options: Omit<EditOptions, 'addedDiff'> & { addedDiff?: JSONObject | null; editKind: EditKind }) {
    super({ tenant: options.tenant, createdBy: options.createdBy });
    this.assign(options);
  }
}
