import { BaseModel } from './base.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { OidcInfo } from '@okampus/shared/dtos';
import type { ITenantCore} from '@okampus/shared/dtos';

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
