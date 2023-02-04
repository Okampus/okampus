import { Field, InterfaceType } from '@nestjs/graphql';
import type { IContentMaster, IIndividual, IOrg, ITenantCore, IUgc } from '@okampus/shared/dtos';
import { UgcKind } from '@okampus/shared/enums';
// eslint-disable-next-line import/no-cycle
import { ContentMasterModel } from './content-master.model';
import { IndividualModel } from './individual.model';
import { OrgModel } from './org.model';
import { TenantScopedModel } from './tenant-scoped.model';

@InterfaceType()
export class UgcModel extends TenantScopedModel implements IUgc {
  @Field(() => UgcKind)
  ugcKind!: UgcKind;

  @Field(() => IndividualModel, { nullable: true })
  author?: IIndividual;

  @Field(() => Boolean)
  isAnonymous!: boolean;

  @Field(() => OrgModel, { nullable: true })
  representingOrg?: IOrg | null;

  @Field(() => ContentMasterModel)
  contentMaster?: IContentMaster;

  constructor(ugc: IUgc) {
    super(ugc.tenant as ITenantCore);
    this.assign(ugc);
  }
}
