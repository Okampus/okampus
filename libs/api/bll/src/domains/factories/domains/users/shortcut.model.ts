// eslint-disable-next-line import/no-cycle
import { UserModel } from '../../index';
import { ActorModel } from '../../index';
import { TenantScopedModel } from '../../index';

import { Field, ObjectType } from '@nestjs/graphql';
import { ShortcutType } from '@okampus/shared/enums';

import type { IActor, IShortcut, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class ShortcutModel extends TenantScopedModel implements IShortcut {
  @Field(() => ShortcutType)
  type!: ShortcutType;

  @Field(() => ActorModel, { nullable: true })
  targetActor?: IActor;

  @Field(() => UserModel, { nullable: true })
  user!: IUser;

  constructor(shortcut: IShortcut) {
    if (!shortcut.tenant) throw new Error('Shortcut must have a tenant');
    super(shortcut.tenant);
    this.assign(shortcut);
  }
}
