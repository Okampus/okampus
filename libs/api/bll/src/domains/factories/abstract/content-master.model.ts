import { IndividualModel } from './individual.model';
import { TenantScopedModel } from './tenant-scoped.model';
// eslint-disable-next-line import/no-cycle
import { UgcModel } from './ugc.model';
import { TagModel } from '../domains/tags/tag.model';
import { ContentMasterKind } from '@okampus/shared/enums';
import { Field, InterfaceType } from '@nestjs/graphql';
import type { IContentMaster, IIndividual, ITag, ITenantCore, IUgc } from '@okampus/shared/dtos';

@InterfaceType()
export class ContentMasterModel extends TenantScopedModel implements IContentMaster {
  @Field(() => [TagModel])
  tags!: ITag[];

  @Field(() => String)
  slug!: string;

  @Field(() => String)
  title!: string;

  @Field(() => ContentMasterKind)
  contentMasterKind!: ContentMasterKind;

  @Field(() => [IndividualModel])
  contributors!: IIndividual[];

  @Field(() => UgcModel, { nullable: true })
  rootContent?: IUgc;

  constructor(contentMaster: IContentMaster) {
    super(contentMaster.tenant as ITenantCore);
    this.assign(contentMaster);
  }
}
