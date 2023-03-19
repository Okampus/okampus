/* eslint-disable import/no-cycle */
import { TenantScopedModel } from '../../index';

import { Field, ObjectType } from '@nestjs/graphql';
import { Colors, RoleKind, TeamRoleKey } from '@okampus/shared/enums';

import type { IRole } from '@okampus/shared/dtos';

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
    if (!role.tenant) throw new Error('Role must have a tenant');
    super(role.tenant);
    this.assign(role);
  }
}
