import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, OneToOne } from '@mikro-orm/core';

import type { ContentMaster } from '../content-master.entity';
import type { IssueOptions } from './issue.options';

@Entity()
export abstract class Issue extends TenantScopedEntity {
  @OneToOne({ type: 'ContentMaster', inversedBy: 'issue' })
  content!: ContentMaster;

  constructor(options: IssueOptions) {
    super(options);
    this.assign(options);
  }
}
