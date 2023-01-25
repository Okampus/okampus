import { Cascade, Entity, Enum, OneToOne, Property } from '@mikro-orm/core';
import { DocumentKind } from '@okampus/shared/enums';
import { UgcKind } from '@okampus/shared/enums';
import { Ugc } from '../ugc.entity';
import { DocumentUpload } from '../../file-upload/document-upload/document-upload.entity';
import { DocumentOptions } from './document.options';

@Entity({
  discriminatorColumn: 'documentKind',
  discriminatorMap: DocumentKind,
}) // Called "TenantDocument" to avoid name collision with native JS "Document"
export class TenantDocument extends Ugc {
  @Enum(() => DocumentKind)
  documentKind!: DocumentKind;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text', nullable: true })
  description: string | null = null;

  @OneToOne({ type: 'DocumentUpload', cascade: [Cascade.ALL] })
  document!: DocumentUpload;

  // Version as a year; e.g. year 2023 is valid for the school year 2023/2024
  // If null, the year is unknown
  @Property({ type: 'smallint', nullable: true })
  yearVersion: number | null = null;

  constructor(options: DocumentOptions & { documentKind: DocumentKind }) {
    super({ ...options, ugcKind: UgcKind.Document });
    this.assign({ ...options, ugcKind: UgcKind.Document });
  }
}
