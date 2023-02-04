// eslint-disable-next-line import/no-cycle
import { UserModel } from './user.model';
import { ActorModel } from '../../abstract/actor.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
import { Field, ObjectType } from '@nestjs/graphql';
import { ShortcutType } from '@okampus/shared/enums';
import type { IActor, IShortcut, ITenantCore, IUser } from '@okampus/shared/dtos';

@ObjectType()
export class ShortcutModel extends TenantScopedModel implements IShortcut {
  @Field(() => ShortcutType)
  type!: ShortcutType;

  @Field(() => ActorModel, { nullable: true })
  targetActor?: IActor;

  @Field(() => UserModel, { nullable: true })
  user!: IUser;

  constructor(shortcut: IShortcut) {
    super(shortcut.tenant as ITenantCore);
    this.assign(shortcut);
  }
}
