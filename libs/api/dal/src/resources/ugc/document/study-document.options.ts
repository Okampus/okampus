import { StudyDocumentProps } from '@okampus/shared/dtos';
import { DocumentOptions } from './document.options';
import { ClassGroup } from '../../org/class-group/class-group.entity';
import { Cohort } from '../../org/cohort/cohort.entity';
import { Subject } from '../../label/subject/subject.entity';

export type StudyDocumentOptions = StudyDocumentProps &
  DocumentOptions & {
    fromClassGroup?: ClassGroup;
    fromCohort?: Cohort;
    subject: Subject;
  };
