import type { ContentMasterKind } from '@okampus/shared/enums';
import type { IIndividual } from '../actor/individual/individual.interface';
import type { ITaggableEntity } from '../taggable-entity.interface';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { IUgc } from '../ugc/ugc.interface';
import type { ContentMasterProps } from './content-master.props';

export type IContentMaster = ITenantScoped &
  ITaggableEntity &
  Required<ContentMasterProps> & {
    contentMasterKind: ContentMasterKind;
    rootContent?: IUgc;
    contributors: IIndividual[];
  };
