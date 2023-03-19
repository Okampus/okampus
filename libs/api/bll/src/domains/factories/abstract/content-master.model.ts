/* eslint-disable import/no-cycle */
import { IndividualModel } from '../index';
import { TenantScopedModel } from '../index';
import { UgcModel } from '../index';
import { TagModel } from '../index';
import { ContentMasterKind } from '@okampus/shared/enums';
import { Field, InterfaceType } from '@nestjs/graphql';
import type { IContentMaster, IIndividual, ITag, IUgc } from '@okampus/shared/dtos';

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
    if (!contentMaster.tenant) throw new Error('Actor must have a tenant');
    super(contentMaster.tenant);
    this.assign(contentMaster);
  }
}
