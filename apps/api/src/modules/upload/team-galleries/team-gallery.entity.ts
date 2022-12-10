import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { BaseFileEntity } from '@lib/entities/base-file.entity';
import { Event } from '@plan/events/event.entity';
import { Team } from '@teams/team.entity';
import type { FileUpload } from '@upload/file-uploads/file-upload.entity';

@ObjectType()
@Entity()
export class TeamGallery extends BaseFileEntity {
  @Field(() => String)
  @PrimaryKey()
  id: string = nanoid(32);

  @Field(() => Team)
  @ManyToOne()
  team!: Team;

  @Field(() => Event, { nullable: true })
  @OneToOne({ type: Event, nullable: true, onDelete: 'CASCADE' })
  event: Event | null = null;

  @Field(() => Int)
  @Property()
  order: number;

  constructor(options: {
    team: Team;
    file: FileUpload;
    order: number;
    event?: Event | null;
    active?: boolean;
  }) {
    super();
    this.assign(options);
  }
}
