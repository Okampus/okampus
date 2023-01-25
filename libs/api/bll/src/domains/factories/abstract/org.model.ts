import { Field, InterfaceType } from '@nestjs/graphql';
import { IActor, IOrg, ITenantCore } from '@okampus/shared/dtos';
import { OrgKind } from '@okampus/shared/enums';
// eslint-disable-next-line import/no-cycle
import { ActorModel } from './actor.model';
import { TenantScopedModel } from './tenant-scoped.model';

@InterfaceType()
export abstract class OrgModel extends TenantScopedModel implements IOrg {
  @Field(() => ActorModel, { nullable: true })
  actor?: IActor;

  @Field(() => OrgKind)
  orgKind!: OrgKind;

  @Field(() => OrgModel, { nullable: true })
  parent?: IOrg | null;

  constructor(org: IOrg) {
    super(org.tenant as ITenantCore);
    this.assign(org);
  }
}
