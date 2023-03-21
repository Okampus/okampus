import type { EditKind } from '@okampus/shared/enums';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { IUgc } from '../ugc/ugc.interface';
import type { EditProps } from './edit.props';

export type IEdit = ITenantScoped &
  Required<EditProps> & {
    editKind: EditKind;
    linkedUgc?: IUgc;
  };
