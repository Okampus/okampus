import { ContentMasterKind } from '@okampus/shared/enums';
import { IIndividual } from '../actor/individual/individual.interface';
import { ITaggableEntity } from '../taggable-entity.interface';
import type { ITenantScoped } from '../tenant-scoped.interface';
import type { IUgc } from '../ugc/ugc.interface';
import { ContentMasterProps } from './content-master.props';

export type IContentMaster = ITenantScoped &
  ITaggableEntity &
  ContentMasterProps & {
    contentMasterKind: ContentMasterKind;
    rootContent?: IUgc;
    contributors: IIndividual[];
  };
