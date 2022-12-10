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
import { TeamImageType } from '@lib/types/enums/team-image-type.enum';
import { Team } from '@teams/team.entity';
import { User } from '@uaa/users/user.entity';
import type { FileUpload } from '@upload/file-uploads/file-upload.entity';

@ObjectType()
@Entity()
export class TeamImage extends BaseFileEntity {
  @Field()
  @PrimaryKey()
  id: string = nanoid(32);

  @Field(() => User)
  @ManyToOne({ type: User, onDelete: 'CASCADE' })
  team: Team;

  @Field(() => TeamImageType)
  @Enum(() => TeamImageType)
  type!: TeamImageType;

  @Field(() => String, { nullable: true })
  @Property()
  descriptor: string | null = null;

  constructor(options: {
    file: FileUpload;
    team: Team;
    type: TeamImageType;
    descriptor?: string | null;
  }) {
    super();
    this.assign(options);
  }
}
