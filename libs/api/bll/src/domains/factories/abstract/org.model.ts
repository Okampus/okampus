// eslint-disable-next-line import/no-cycle
import { ActorModel, TenantEventModel, TenantScopedModel, OrgDocumentModel } from '../index';
import { Field, InterfaceType } from '@nestjs/graphql';
import { OrgKind } from '@okampus/shared/enums';

import type { IActor, IOrg, IOrgDocument, ITenantEvent } from '@okampus/shared/dtos';

@InterfaceType({
  resolveType: (value) => {
    if (value.orgKind === OrgKind.Tenant) return 'TenantModel';
    if (value.orgKind === OrgKind.Team) return 'TeamModel';
    return 'OrgModel';
  },
})
export abstract class OrgModel extends TenantScopedModel implements IOrg {
  @Field(() => OrgKind)
  orgKind!: OrgKind;

  @Field(() => ActorModel)
  actor?: IActor;

  @Field(() => OrgModel, { nullable: true })
  parent?: IOrg | null;

  @Field(() => [OrgDocumentModel])
  documents!: IOrgDocument[];

  @Field(() => [TenantEventModel])
  events!: ITenantEvent[];

  constructor(org: IOrg) {
    if (!org.tenant) throw new Error('Org must have a tenant');
    super(org.tenant);
    this.assign(org);
  }
}
