import { DocumentRepository } from './document.repository';
import { TenantScopedEntity } from '../tenant-scoped.entity';
import { Cascade, Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { DocumentType } from '@okampus/shared/enums';

import type { Team } from '../team/team.entity';
import type { Subject } from '../class-group/subject/subject.entity';
import type { FileUpload } from '../file-upload/file-upload.entity';
import type { DocumentOptions } from './document.options';

@Entity({ customRepository: () => DocumentRepository })
export class Document extends TenantScopedEntity {
  [EntityRepositoryType]!: DocumentRepository;

  @Property({ type: 'text' })
  name!: string;

  @Property({ type: 'text' })
  description!: string;

  // Version as a year; e.g. year 2023 is valid for the school year 2023/2024
  // If null, the year is unknown
  @Property({ type: 'smallint', nullable: true, default: null })
  yearVersion: number | null = null;

  @Enum({ items: () => DocumentType, type: EnumType })
  type: DocumentType = DocumentType.Other;

  @OneToOne({ type: 'FileUpload', cascade: [Cascade.ALL] })
  file!: FileUpload;

  @ManyToOne({ type: 'Subject', nullable: true, default: null })
  subject: Subject | null = null;

  @ManyToOne({ type: 'Team', nullable: true, default: null })
  team: Team | null = null;

  constructor(options: DocumentOptions) {
    super(options);
    this.assign(options);
  }
}
