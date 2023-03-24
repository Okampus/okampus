// eslint-disable-next-line import/no-cycle
import { ProjectRoleModel, RoleModel, TenantEventModel, UserModel } from '../../index';

import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { IEventRole, IProjectRole, ITenantEvent, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class EventRoleModel extends RoleModel implements IEventRole {
  @Field(() => ProjectRoleModel)
  linkedProjectRole!: IProjectRole;

  @Field(() => TenantEventModel)
  event?: ITenantEvent;

  @Field(() => UserModel, { nullable: true })
  user: IUser | null = null;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => Boolean)
  autoAccept!: boolean;

  @Field(() => Int, { nullable: true })
  rewardMinimum: number | null = null;

  @Field(() => Int, { nullable: true })
  rewardMaximum: number | null = null;

  constructor(role: IEventRole) {
    super(role);
    this.assign(role);
  }
}
