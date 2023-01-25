import { DocumentEditProps } from '@okampus/shared/dtos';
import { TenantScopedOptions } from '../../../shards/abstract/tenant-scoped/tenant-scoped.options';
import { Individual } from '../../actor/individual/individual.entity';
import { TenantDocument } from '../document/document.entity';

export type DocumentEditOptions = DocumentEditProps &
  TenantScopedOptions & {
    addedDocument: TenantDocument;
    editedBy: Individual;
    order: number;
  };
