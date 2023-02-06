import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { Colors, RoleKind, TeamRoleKey } from '@okampus/shared/enums';
import type { IRole, ITenantCore } from '@okampus/shared/dtos';

@ObjectType()
export class RoleModel extends TenantScopedModel implements IRole {
  @Field(() => RoleKind)
  roleKind!: RoleKind;

  @Field(() => String)
  name!: string;

  @Field(() => Colors)
  color!: Colors;

  @Field(() => TeamRoleKey, { nullable: true })
  key!: TeamRoleKey | null;

  @Field(() => Boolean)
  required!: boolean;

  constructor(role: IRole) {
    super(role.tenant as ITenantCore);
    this.assign(role);
  }
}
