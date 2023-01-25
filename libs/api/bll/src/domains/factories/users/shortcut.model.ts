import { Field, ObjectType } from '@nestjs/graphql';
import { IShortcut, ITenantCore, IUser } from '@okampus/shared/dtos';
import { TenantScopedModel } from '../abstract/tenant-scoped.model';
import { UserModel } from './user.model';

@ObjectType()
export class ShortcutModel extends TenantScopedModel implements IShortcut {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  subroute!: string;

  @Field(() => String)
  resourceId!: string;

  @Field(() => UserModel, { nullable: true })
  user!: IUser;

  constructor(shortcut: IShortcut) {
    super(shortcut.tenant as ITenantCore);
    this.assign(shortcut);
  }
}
