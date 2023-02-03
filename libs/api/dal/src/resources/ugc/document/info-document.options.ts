import { InfoDocumentProps } from '@okampus/shared/dtos';
import { DocumentOptions } from './document.options';
import { ClassGroup } from '../../org/class-group/class-group.entity';
import { Cohort } from '../../org/cohort/cohort.entity';

export type InfoDocumentOptions = InfoDocumentProps &
  DocumentOptions & {
    classGroup?: ClassGroup;
    cohort?: Cohort;
  };
