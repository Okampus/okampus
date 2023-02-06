import type { StudyDocumentProps } from '@okampus/shared/dtos';
import type { DocumentOptions } from './document.options';
import type { ClassGroup } from '../../org/class-group/class-group.entity';
import type { Cohort } from '../../org/cohort/cohort.entity';
import type { Subject } from '../../label/subject/subject.entity';

export type StudyDocumentOptions = StudyDocumentProps &
  DocumentOptions & {
    fromClassGroup?: ClassGroup;
    fromCohort?: Cohort;
    subject: Subject;
  };
