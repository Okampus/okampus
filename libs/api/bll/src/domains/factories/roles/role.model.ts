import { Field, ObjectType } from '@nestjs/graphql';
import { IRole, ITenantCore } from '@okampus/shared/dtos';
import { Colors, RoleKind } from '@okampus/shared/enums';
import { TenantScopedModel } from '../abstract/tenant-scoped.model';

@ObjectType()
export class RoleModel extends TenantScopedModel implements IRole {
  @Field(() => RoleKind)
  roleKind!: RoleKind;

  @Field(() => String)
  name!: string;

  @Field(() => Colors)
  color!: Colors;

  @Field(() => Boolean)
  required!: boolean;

  constructor(role: IRole) {
    super(role.tenant as ITenantCore);
    this.assign(role);
  }
}
