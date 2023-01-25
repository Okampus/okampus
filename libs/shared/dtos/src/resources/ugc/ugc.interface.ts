import { UgcKind } from '@okampus/shared/enums';
import { IIndividual } from '../actor/individual/individual.interface';
import { IContentMaster } from '../content-master/content-master.interface';
import { IOrg } from '../org/org.interface';
import type { ITenantScopedEntity } from '../tenant-scoped.interface';
import { UgcProps } from './ugc.props';

export type IUgc = ITenantScopedEntity &
  UgcProps & {
    ugcKind: UgcKind;
    isAnonymous: boolean;
    author?: IIndividual;
    org?: IOrg | null;
    contentMaster?: IContentMaster | null;
  };
