import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Entity, Enum, EnumType, ManyToOne, Property } from '@mikro-orm/core';
import { DocumentType } from '@okampus/shared/enums';

import type { DocumentEditOptions } from './document-edit.options';
import type { Document } from '../document.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';

@Entity()
export class DocumentEdit extends TenantScopedEntity {
  @ManyToOne({ type: 'FileUpload' })
  newVersion!: FileUpload;

  @ManyToOne({ type: 'Document', onDelete: 'CASCADE' })
  document!: Document;

  @Enum({ items: () => DocumentType, type: EnumType })
  type: DocumentType = DocumentType.Other;

  // Version as a year; e.g. year 2023 is valid for the school year 2023/2024
  // If null, the year is unknown
  @Property({ type: 'smallint', nullable: true, default: null })
  yearVersion: number | null = null;

  constructor(options: DocumentEditOptions) {
    super(options);
    this.assign(options);
  }
}
