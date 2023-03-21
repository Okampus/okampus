/* eslint-disable import/no-cycle */
import { BaseModel } from './base.model';
import { IndividualModel, TenantCoreModel } from '../index';
import { Field, InterfaceType, ObjectType } from '@nestjs/graphql';

import type { ITenantCore, ITenantScoped } from '@okampus/shared/dtos';

@InterfaceType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export abstract class TenantScopedModel extends BaseModel implements ITenantScoped {
  @Field(() => TenantCoreModel, { nullable: true })
  tenant?: ITenantCore;

  @Field(() => IndividualModel, { nullable: true })
  createdBy?: IndividualModel | null;

  @Field(() => Date, { nullable: true })
  lastHiddenAt!: Date | null;

  constructor(tenant: ITenantCore) {
    super();
    this.tenant = tenant;
  }
}
