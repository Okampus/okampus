import { Field, InterfaceType } from '@nestjs/graphql';
import type { IActor, IOrg, IOrgDocument, ITenantCore } from '@okampus/shared/dtos';
import { OrgKind } from '@okampus/shared/enums';
// eslint-disable-next-line import/no-cycle
import { OrgDocumentModel } from '../domains/documents/org-document.model';
// eslint-disable-next-line import/no-cycle
import { ActorModel } from './actor.model';
import { TenantScopedModel } from './tenant-scoped.model';

@InterfaceType({
  resolveType: (value) => {
    if (value.orgKind === OrgKind.Tenant) {
      return 'TenantModel';
    }
    if (value.orgKind === OrgKind.Team) {
      return 'TeamModel';
    }
    return 'OrgModel';
  },
})
export abstract class OrgModel extends TenantScopedModel implements IOrg {
  @Field(() => ActorModel, { nullable: true })
  actor?: IActor;

  @Field(() => OrgKind)
  orgKind!: OrgKind;

  @Field(() => OrgModel, { nullable: true })
  parent?: IOrg | null;

  @Field(() => [OrgDocumentModel])
  documents!: IOrgDocument[];

  constructor(org: IOrg) {
    super(org.tenant as ITenantCore);
    this.assign(org);
  }
}
