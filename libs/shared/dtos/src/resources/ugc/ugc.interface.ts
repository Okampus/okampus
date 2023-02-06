import type { UgcKind } from '@okampus/shared/enums';
import type { IIndividual } from '../actor/individual/individual.interface';
import type { IContentMaster } from '../content-master/content-master.interface';
import type { IOrg } from '../org/org.interface';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { UgcProps } from './ugc.props';

export type IUgc = ITenantScoped &
  UgcProps & {
    ugcKind: UgcKind;
    isAnonymous: boolean;
    author?: IIndividual;
    representingOrg?: IOrg | null;
    contentMaster?: IContentMaster | null;
  };
