import { UgcKind } from '@okampus/shared/enums';
import { IIndividual } from '../actor/individual/individual.interface';
import { IContentMaster } from '../content-master/content-master.interface';
import { IOrg } from '../org/org.interface';
import type { ITenantScoped } from '../tenant-scoped.interface';
import { UgcProps } from './ugc.props';

export type IUgc = ITenantScoped &
  UgcProps & {
    ugcKind: UgcKind;
    isAnonymous: boolean;
    author?: IIndividual;
    representingOrg?: IOrg | null;
    contentMaster?: IContentMaster | null;
  };
