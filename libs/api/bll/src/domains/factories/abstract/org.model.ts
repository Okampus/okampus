// eslint-disable-next-line import/no-cycle
import { ActorModel } from './actor.model';
import { TenantScopedModel } from './tenant-scoped.model';
// eslint-disable-next-line import/no-cycle
import { OrgDocumentModel } from '../domains/documents/org-document.model';
import { Field, InterfaceType } from '@nestjs/graphql';
import { OrgKind } from '@okampus/shared/enums';
import type { IActor, IOrg, IOrgDocument } from '@okampus/shared/dtos';

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
    if (!org.tenant) throw new Error('Org must have a tenant');
    super(org.tenant);
    this.assign(org);
  }
}
