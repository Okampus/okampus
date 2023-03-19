// eslint-disable-next-line import/no-cycle
import { ContentMasterModel } from '../index';
import { IndividualModel } from '../index';
import { OrgModel } from '../index';
import { TenantScopedModel } from '../index';
import { UgcKind } from '@okampus/shared/enums';
import { Field, InterfaceType } from '@nestjs/graphql';
import type { IContentMaster, IIndividual, IOrg, IUgc } from '@okampus/shared/dtos';

@InterfaceType()
export class UgcModel extends TenantScopedModel implements IUgc {
  @Field(() => UgcKind)
  ugcKind!: UgcKind;

  @Field(() => String)
  description!: string;

  @Field(() => IndividualModel, { nullable: true })
  author?: IIndividual;

  @Field(() => Boolean)
  isAnonymous!: boolean;

  @Field(() => [OrgModel])
  representingOrgs?: IOrg[];

  @Field(() => ContentMasterModel)
  contentMaster?: IContentMaster;

  constructor(ugc: IUgc) {
    if (!ugc.tenant) throw new Error('Ugc must have a tenant');
    super(ugc.tenant);
    this.assign(ugc);
  }
}
