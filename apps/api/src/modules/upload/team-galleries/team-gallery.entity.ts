import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { nanoid } from 'nanoid';
import { BaseFileEntity } from '@common/lib/entities/base-file-entity';
import { Team } from '@modules/org/teams/team.entity';
import { Event } from '@modules/plan/events/event.entity';
import type { FileUpload } from '../file-uploads/file-upload.entity';

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
