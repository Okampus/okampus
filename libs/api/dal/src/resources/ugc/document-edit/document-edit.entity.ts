import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { TenantScopedEntity } from '../../../shards/abstract/tenant-scoped/tenant-scoped.entity';
import { DocumentEditOptions } from './document-edit.options';
import { DocumentUpload } from '../../file-upload/document-upload/document-upload.entity';
import { Individual } from '../../actor/individual/individual.entity';
import { TenantDocument } from '../document/document.entity';

@Entity()
export class DocumentEdit extends TenantScopedEntity {
  @ManyToOne({ type: 'DocumentUpload' })
  documentUpload!: DocumentUpload;

  @Property({ type: 'smallint' })
  order!: number;

  @ManyToOne({ type: 'Individual', onDelete: 'CASCADE' })
  editedBy!: Individual;

  @ManyToOne({ type: 'TenantDocument' })
  linkedDocument!: TenantDocument;

  // Version as a year; e.g. year 2023 is valid for the school year 2023/2024
  // If null, the year is unknown
  @Property({ type: 'smallint', nullable: true })
  yearVersion: number | null = null;

  constructor(options: DocumentEditOptions) {
    super({ tenant: options.tenant });
    this.assign(options);
  }
}
