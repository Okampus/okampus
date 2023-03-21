/* eslint-disable import/no-cycle */
import { EditModel } from '../index';
import { ContentMasterModel } from '../index';
import { IndividualModel } from '../index';
import { OrgModel } from '../index';
import { TenantScopedModel } from '../index';
import { UgcKind } from '@okampus/shared/enums';
import { Field, InterfaceType } from '@nestjs/graphql';

import type { IContentMaster, IEdit, IIndividual, IOrg, IUgc } from '@okampus/shared/dtos';

@InterfaceType()
export class UgcModel extends TenantScopedModel implements IUgc {
  @Field(() => UgcKind)
  ugcKind!: UgcKind;

  @Field(() => Boolean)
  isAnonymous!: boolean;

  @Field(() => String)
  description!: string;

  @Field(() => [EditModel])
  edits?: IEdit[];

  @Field(() => [OrgModel])
  representingOrgs?: IOrg[];

  // @Field(() => EditModel, { nullable: true })
  // lastEdit?: IEdit | null;

  @Field(() => IndividualModel, { nullable: true })
  author?: IIndividual | null;

  @Field(() => ContentMasterModel, { nullable: true })
  contentMaster?: IContentMaster | null;

  constructor(ugc: IUgc) {
    if (!ugc.tenant) throw new Error('Ugc must have a tenant');
    super(ugc.tenant);
    this.assign(ugc);
  }
}
