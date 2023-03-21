import { OrgDocumentRepository } from './org-document.repository';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { Org } from '../../org/org.entity';
import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { OrgDocumentType } from '@okampus/shared/enums';
import type { OrgDocumentOptions } from './org-document.options';
import type { TenantDocument } from '../../ugc/document/document.entity';

@Entity({ customRepository: () => OrgDocumentRepository })
export class OrgDocument extends TenantScopedEntity {
  @ManyToOne(() => Org)
  org!: Org;

  @ManyToOne({ type: 'TenantDocument' })
  document!: TenantDocument;

  @Enum({ items: () => OrgDocumentType, type: 'string' })
  type!: OrgDocumentType;

  constructor(options: OrgDocumentOptions) {
    super({ tenant: options.tenant, createdBy: options.createdBy });
    this.assign(options);
  }
}
