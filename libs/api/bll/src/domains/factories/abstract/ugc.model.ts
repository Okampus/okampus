// eslint-disable-next-line import/no-cycle
import { ContentMasterModel } from './content-master.model';
import { IndividualModel } from './individual.model';
import { OrgModel } from './org.model';
import { TenantScopedModel } from './tenant-scoped.model';
import { UgcKind } from '@okampus/shared/enums';
import { Field, InterfaceType } from '@nestjs/graphql';
import type { IContentMaster, IIndividual, IOrg, IUgc } from '@okampus/shared/dtos';

@InterfaceType()
export class UgcModel extends TenantScopedModel implements IUgc {
  @Field(() => UgcKind)
  ugcKind!: UgcKind;

  @Field(() => String)
  text!: string;

  @Field(() => IndividualModel, { nullable: true })
  author?: IIndividual;

  @Field(() => Boolean)
  isAnonymous!: boolean;

  @Field(() => OrgModel, { nullable: true })
  representingOrg?: IOrg | null;

  @Field(() => ContentMasterModel)
  contentMaster?: IContentMaster;

  constructor(ugc: IUgc) {
    if (!ugc.tenant) throw new Error('Ugc must have a tenant');
    super(ugc.tenant);
    this.assign(ugc);
  }
}
