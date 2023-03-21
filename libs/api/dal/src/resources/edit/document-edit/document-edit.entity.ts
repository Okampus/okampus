import { Edit } from '../edit.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { EditKind } from '@okampus/shared/enums';

import type { DocumentEditOptions } from './document-edit.options';
import type { DocumentUpload } from '../../file-upload/document-upload/document-upload.entity';

@Entity()
export class DocumentEdit extends Edit {
  @ManyToOne({ type: 'DocumentUpload' })
  newVersion!: DocumentUpload;

  // Version as a year; e.g. year 2023 is valid for the school year 2023/2024
  // If null, the year is unknown
  @Property({ type: 'smallint', nullable: true })
  yearVersion: number | null = null;

  constructor(options: DocumentEditOptions) {
    super({ ...options, editKind: EditKind.DocumentEdit });
    this.assign({ ...options, editKind: EditKind.DocumentEdit });
  }
}
