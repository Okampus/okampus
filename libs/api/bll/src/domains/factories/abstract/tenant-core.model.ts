import { Field, ObjectType } from '@nestjs/graphql';
import { ITenantCore, OidcInfo } from '@okampus/shared/dtos';
import { BaseModel } from './base.model';

@ObjectType()
export class TenantCoreModel extends BaseModel implements ITenantCore {
  @Field(() => String)
  domain!: string;

  @Field(() => String)
  name!: string;

  @Field(() => OidcInfo)
  oidcInfo!: OidcInfo;

  constructor(tenantCore: ITenantCore) {
    super();
    this.assign(tenantCore);
  }
}
