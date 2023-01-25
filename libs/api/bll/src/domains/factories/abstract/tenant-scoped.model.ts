import { Field, InterfaceType, ObjectType } from '@nestjs/graphql';
import { ITenantCore, ITenantScopedEntity } from '@okampus/shared/dtos';
import { BaseModel } from './base.model';
import { TenantCoreModel } from './tenant-core.model';

@InterfaceType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export abstract class TenantScopedModel extends BaseModel implements ITenantScopedEntity {
  @Field(() => TenantCoreModel, { nullable: true })
  tenant?: ITenantCore;

  @Field(() => Date, { nullable: true })
  lastHiddenAt!: Date | null;

  constructor(tenant: ITenantCore) {
    super();
    this.tenant = tenant;
  }
}
