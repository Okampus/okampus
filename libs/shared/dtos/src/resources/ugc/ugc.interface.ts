import type { IEdit } from '../edit/edit.interface';
import type { UgcKind } from '@okampus/shared/enums';
import type { IIndividual } from '../actor/individual/individual.interface';
import type { IContentMaster } from '../content-master/content-master.interface';
import type { IOrg } from '../org/org.interface';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { UgcProps } from './ugc.props';

export type IUgc = ITenantScoped &
  Required<UgcProps> & {
    ugcKind: UgcKind;
    isAnonymous: boolean;
    edits?: IEdit[];
    representingOrgs?: IOrg[];
    author?: IIndividual | null;
    contentMaster?: IContentMaster | null;
  };
