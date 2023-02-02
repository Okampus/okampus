import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { OrgDocumentOptions } from './org-document.options';
import { Org } from '../../org/org.entity';
import { OrgDocumentType } from '@okampus/shared/enums';
import type { TenantDocument } from '../../ugc/document/document.entity';
// eslint-disable-next-line import/no-cycle
import { OrgDocumentRepository } from './org-document.repository';

@Entity({
  customRepository: () => OrgDocumentRepository,
})
export class OrgDocument extends TenantScopedEntity {
  @ManyToOne(() => Org)
  org!: Org;

  @ManyToOne({ type: 'TenantDocument' })
  document!: TenantDocument;

  @Enum(() => OrgDocumentType)
  type!: OrgDocumentType;

  constructor(options: OrgDocumentOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
