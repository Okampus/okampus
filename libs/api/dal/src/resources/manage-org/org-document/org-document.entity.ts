import { Entity, Enum, ManyToOne } from '@mikro-orm/core';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { OrgDocumentOptions } from './org-document.options';
import { Org } from '../../org/org.entity';
import { OrgDocumentType } from '@okampus/shared/enums';
import { DocumentUpload } from '../../file-upload/document-upload/document-upload.entity';

@Entity()
export class OrgDocument extends TenantScopedEntity {
  @ManyToOne(() => Org)
  org!: Org;

  @ManyToOne(() => DocumentUpload)
  document!: DocumentUpload;

  @Enum(() => OrgDocumentType)
  type!: OrgDocumentType;

  constructor(options: OrgDocumentOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
