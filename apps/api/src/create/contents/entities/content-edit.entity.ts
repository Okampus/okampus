/* eslint-disable import/no-cycle */
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { BaseEntity } from '../../../shared/lib/entities/base.entity';
import { User } from '../../../uua/users/user.entity';
import { Content } from './content.entity';

@ObjectType()
@Entity()
export class ContentEdit extends BaseEntity {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field()
  @Property({ type: 'text' })
  body!: string;

  @Field(() => Int)
  @Property()
  editOrder!: number;

  @Field(() => Content)
  @ManyToOne({ onDelete: 'CASCADE' })
  parent!: Content;

  @Field(() => User)
  @ManyToOne({ onDelete: 'CASCADE' })
  @Transform(({ obj }: { obj: ContentEdit }) => obj.editedBy.id)
  editedBy!: User;

  constructor(options: {
    body: string;
    parent: Content;
    editedBy: User;
    editOrder: number;
  }) {
    super();
    this.assign(options);
  }
}
