import { TenantDocument } from './document.entity';
import { Entity, ManyToOne } from '@mikro-orm/core';
import { DocumentKind } from '@okampus/shared/enums';
import type { InfoDocumentOptions } from './info-document.options';
import type { ClassGroup } from '../../org/class-group/class-group.entity';
import type { Cohort } from '../../org/cohort/cohort.entity';

@Entity()
export class InfoDocument extends TenantDocument {
  // ClassGroup that is associated with this document
  // If null; the document is accessible to the whole cohort
  // If both Cohort and ClassGroup are null; the document is public
  @ManyToOne({ type: 'ClassGroup', nullable: true })
  classGroup: ClassGroup | null = null;

  // Cohort that is associated with this document
  // If null; the document is accessible to all cohorts
  // If both Cohort and ClassGroup are null; the document is public
  @ManyToOne({ type: 'Cohort', nullable: true })
  cohort: Cohort | null = null;

  constructor(options: InfoDocumentOptions) {
    super({ ...options, documentKind: DocumentKind.InfoDocument });
    this.assign({ ...options, documentKind: DocumentKind.InfoDocument });
  }
}
