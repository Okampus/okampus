import { Field, ObjectType } from '@nestjs/graphql';
import { IActor, IShortcut, ITenantCore, IUser } from '@okampus/shared/dtos';
import { ShortcutType } from '@okampus/shared/enums';
import { ActorModel } from '../../abstract/actor.model';
import { TenantScopedModel } from '../../abstract/tenant-scoped.model';
// eslint-disable-next-line import/no-cycle
import { UserModel } from './user.model';

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
