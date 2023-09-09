import { TeamDocumentRepository } from './team-document.repository';
import { TenantScopedEntity } from '../../tenant-scoped.entity';
import { Cascade, Entity, EntityRepositoryType, Enum, EnumType, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { DocumentType } from '@okampus/shared/enums';

import type { TeamDocumentOptions } from './team-document.options';
import type { Team } from '../team.entity';
import type { FileUpload } from '../../file-upload/file-upload.entity';
import type { RequiredDocument } from '../../tenant/required-document/required-document.entity';

@Entity({ customRepository: () => TeamDocumentRepository })
export class TeamDocument extends TenantScopedEntity {
  [EntityRepositoryType]!: TeamDocumentRepository;

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

  @ManyToOne({ type: 'Team' })
  team!: Team;

  @ManyToOne({ type: 'RequiredDocument', nullable: true, default: null })
  requiredDocument: RequiredDocument | null = null;

  constructor(options: TeamDocumentOptions) {
    super(options);
    this.assign(options);
  }
}
