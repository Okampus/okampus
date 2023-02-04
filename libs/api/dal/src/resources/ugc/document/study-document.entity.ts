import { Entity, ManyToOne } from '@mikro-orm/core';
import { DocumentKind } from '@okampus/shared/enums';
import { TenantDocument } from './document.entity';
import type { InfoDocumentOptions } from './info-document.options';
import type { ClassGroup } from '../../org/class-group/class-group.entity';
import type { Cohort } from '../../org/cohort/cohort.entity';
import type { Subject } from '../../label/subject/subject.entity';

@Entity()
export class StudyDocument extends TenantDocument {
  // ClassGroup that is associated with this document
  // If null; the ClassGroup is unknown
  @ManyToOne({ type: 'ClassGroup', nullable: true })
  fromClassGroup: ClassGroup | null = null;

  // Cohort that is associated with this document
  // If null; the Cohort is unknown
  @ManyToOne({ type: 'Cohort', nullable: true })
  fromCohort: Cohort | null = null;

  @ManyToOne({ type: 'Subject' })
  subject!: Subject;

  constructor(options: InfoDocumentOptions) {
    super({ ...options, documentKind: DocumentKind.InfoDocument });
    this.assign({ ...options, documentKind: DocumentKind.InfoDocument });
  }
}
