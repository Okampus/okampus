/* eslint-disable import/no-cycle */
import {
  Entity,
  Enum,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { BaseFileEntity } from '@common/lib/entities/base-file-entity';
import { UserImageType } from '@common/lib/types/enums/user-image-type.enum';
import type { FileUpload } from '@modules/upload/file-uploads/file-upload.entity';
import { User } from '@modules/uua/users/user.entity';

@ObjectType()
@Entity()
export class UserImage extends BaseFileEntity {
  @Field()
  @PrimaryKey()
  id: string = nanoid(32);

  @Field(() => User)
  @ManyToOne({ type: User, onDelete: 'CASCADE' })
  user: User;

  @Field(() => UserImageType)
  @Enum(() => UserImageType)
  type!: UserImageType;

  @Field(() => String, { nullable: true })
  @Property()
  descriptor: string | null = null;

  constructor(options: {
    file: FileUpload;
    user?: User | null;
    active?: boolean;
    type: string;
    descriptor?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
