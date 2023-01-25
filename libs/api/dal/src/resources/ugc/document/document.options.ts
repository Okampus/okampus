import { DocumentProps } from '@okampus/shared/dtos';
import { UgcOptions } from '../ugc.options';
import type { TenantDocument } from './document.entity';

export type DocumentOptions = DocumentProps &
  UgcOptions & {
    document: TenantDocument;
  };
