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
import { BaseFileEntity } from '@lib/entities/base-file.entity';
import { UserImageType } from '@lib/types/enums/user-image-type.enum';
import { User } from '@uaa/users/user.entity';
import type { FileUpload } from '@upload/file-uploads/file-upload.entity';

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
    user: User;
    type: UserImageType;
    descriptor?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
