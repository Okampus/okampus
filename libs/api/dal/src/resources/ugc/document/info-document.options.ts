import type { InfoDocumentProps } from '@okampus/shared/dtos';
import type { DocumentOptions } from './document.options';
import type { ClassGroup } from '../../org/class-group/class-group.entity';
import type { Cohort } from '../../org/cohort/cohort.entity';

export type InfoDocumentOptions = InfoDocumentProps &
  DocumentOptions & {
    classGroup?: ClassGroup;
    cohort?: Cohort;
  };
